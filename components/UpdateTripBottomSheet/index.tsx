import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  BottomSheet,
  Button,
  Icon,
  Input,
  Text,
  makeStyles,
} from "@rneui/themed";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Alert, ToastAndroid, View } from "react-native";
import { z } from "zod";

import PT_BR from "../../lang/pt-br";
import { updateTrip, useGetTripById } from "../../providers/trips";
import { useInputStyle } from "../../styles/inputs";
import { getReadableValidationErrorMessage } from "../../utils/forms";

type Props = {
  isVisible: boolean;
  tripId: number;
  token: string;
  onClose: () => void;
};

const updateTripFormSchema = z
  .object({
    destination: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(["CREATED", "INPROGRESS", "FINISHED"]),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: PT_BR.VALIDATION.END_DATE_GREATER_THAN_START_DATE,
    path: ["endDate"],
  });

export type updateTripFormData = z.infer<typeof updateTripFormSchema>;

function UpdateTripBottomSheet({ isVisible, tripId, token, onClose }: Props) {
  const styles = useStyles();
  const inputStyle = useInputStyle();

  const {
    data: tripData,
    isLoading: isLoadingTrip,
    refetch,
  } = useGetTripById(tripId, token);

  const defaultValues = {
    destination: tripData?.destination || "",
    startDate: tripData?.startDate ? new Date(tripData?.startDate) : new Date(),
    endDate: tripData?.endDate ? new Date(tripData?.endDate) : new Date(),
    status: tripData?.status || "CREATED",
  };

  const methods = useForm<updateTripFormData>({
    resolver: zodResolver(updateTripFormSchema),
    defaultValues,
  });

  const watchStartDate = methods.watch("startDate");
  const watchEndDate = methods.watch("endDate");

  const showDatePicker = (date: "start" | "end") => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: date === "start" ? watchStartDate : watchEndDate,
      onChange: (_, selectedDate) => {
        const currentDate =
          selectedDate || (date === "start" ? watchStartDate : watchEndDate);
        methods.setValue(
          date === "start" ? "startDate" : "endDate",
          currentDate,
        );
      },
    });
  };

  const onError: SubmitErrorHandler<updateTripFormData> = (errors, e) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  const onSubmit: SubmitHandler<updateTripFormData> = async (
    data: updateTripFormData,
  ) => {
    const hasUpdatedTrip = await updateTrip(tripId, data, token);

    if (hasUpdatedTrip) {
      ToastAndroid.show(PT_BR.UPDATE_TRIP_FORM.SUCCESS, ToastAndroid.SHORT);
      onClose();
    }
  };

  const closeModal = () => {
    methods.reset({
      destination: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "CREATED",
    });
    onClose();
  };

  useEffect(() => {
    refetch().then(() => {
      methods.reset(defaultValues);
    });
  }, [tripId, isLoadingTrip]);

  return (
    <>
      <BottomSheet isVisible={isVisible}>
        <View style={styles.bottomSheet}>
          <Text style={styles.textTitle} h4>
            {PT_BR.UPDATE_TRIP_FORM.TITLE}
          </Text>

          <FormProvider {...methods}>
            <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label={PT_BR.UPDATE_TRIP_FORM.WHERE}
                  placeholder={PT_BR.UPDATE_TRIP_FORM.WHERE_PLACEHOLDER}
                  errorStyle={{ color: "red" }}
                  errorMessage={error?.message && PT_BR.VALIDATION.NOT_EMPTY}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  inputStyle={inputStyle.input}
                  inputContainerStyle={inputStyle.inputContainer}
                />
              )}
              name="destination"
            />
            <View style={styles.buttonArea}>
              <View style={styles.dateButtonArea}>
                <Button
                  onPress={() => showDatePicker("start")}
                  title={
                    <Icon color="#FFF" type="ionicon" name="calendar-outline" />
                  }
                />
                <Text>{`  ${
                  PT_BR.UPDATE_TRIP_FORM.WHEN_FROM
                } ${watchStartDate.toLocaleDateString("pt-BR")}`}</Text>
              </View>

              <View style={styles.dateButtonArea}>
                <Button
                  onPress={() => showDatePicker("end")}
                  title={
                    <Icon color="#FFF" type="ionicon" name="calendar-outline" />
                  }
                />
                <Text>{`  ${
                  PT_BR.UPDATE_TRIP_FORM.WHEN_TO
                } ${watchEndDate.toLocaleDateString("pt-BR")}`}</Text>
              </View>

              <View style={styles.submitButtonArea}>
                <Button
                  onPress={() => closeModal()}
                  title={PT_BR.UPDATE_TRIP_FORM.CANCEL}
                  style={styles.submitButton}
                />
                <Button
                  onPress={methods.handleSubmit(onSubmit, onError)}
                  title={PT_BR.UPDATE_TRIP_FORM.SUBMIT}
                  style={styles.submitButton}
                />
              </View>
            </View>
          </FormProvider>
        </View>
      </BottomSheet>
    </>
  );
}

const useStyles = makeStyles(() => ({
  bottomSheet: { backgroundColor: "white", padding: 16 },
  textTitle: { paddingBottom: 10 },
  buttonArea: { paddingHorizontal: 10 },
  dateButtonArea: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginBottom: 5,
  },
  submitButtonArea: {
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    marginVertical: 15,
  },
}));

export default UpdateTripBottomSheet;
