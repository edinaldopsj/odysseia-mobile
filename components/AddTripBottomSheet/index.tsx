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
import { addTrip } from "../../providers/trips";
import { useInputStyle } from "../../styles/inputs";
import { getReadableValidationErrorMessage } from "../../utils/forms";

type Props = {
  isVisible: boolean;
  token: string;
  onClose: () => void;
};

const createTripFormSchema = z
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

export type createTripFormData = z.infer<typeof createTripFormSchema>;

function AddTripBottomSheet({ isVisible, token, onClose }: Props) {
  const styles = useStyles();
  const inputStyle = useInputStyle();

  const methods = useForm<createTripFormData>({
    resolver: zodResolver(createTripFormSchema),
    defaultValues: {
      destination: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "CREATED",
    },
  });

  const watchStartDate = methods.watch("startDate");
  const watchEndDate = methods.watch("endDate");

  const showDatePicker = (date: "start" | "end") => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: date === "start" ? watchStartDate : watchEndDate,
      onChange: (event, selectedDate) => {
        const currentDate =
          selectedDate || (date === "start" ? watchStartDate : watchEndDate);
        methods.setValue(
          date === "start" ? "startDate" : "endDate",
          currentDate,
        );
      },
    });
  };

  const onError: SubmitErrorHandler<createTripFormData> = (errors, e) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  const onSubmit: SubmitHandler<createTripFormData> = async (
    data: createTripFormData,
  ) => {
    const hasAddedTrip = await addTrip(data, token);

    if (hasAddedTrip) {
      ToastAndroid.show(PT_BR.ADD_TRIP_FORM.SUCCESS, ToastAndroid.SHORT);
      onClose();
    }
  };

  const closeModal = () => {
    methods.reset();
    onClose();
  };

  return (
    <>
      <BottomSheet isVisible={isVisible}>
        <View style={styles.bottomSheet}>
          <Text style={styles.textTitle} h4>
            {PT_BR.ADD_TRIP_FORM.TITLE}
          </Text>

          <FormProvider {...methods}>
            <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label={PT_BR.ADD_TRIP_FORM.WHERE}
                  placeholder={PT_BR.ADD_TRIP_FORM.WHERE_PLACEHOLDER}
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
                  PT_BR.ADD_TRIP_FORM.WHEN_FROM
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
                  PT_BR.ADD_TRIP_FORM.WHEN_TO
                } ${watchEndDate.toLocaleDateString("pt-BR")}`}</Text>
              </View>

              <View style={styles.submitButtonArea}>
                <Button
                  onPress={() => closeModal()}
                  title={PT_BR.ADD_TRIP_FORM.CANCEL}
                  style={styles.submitButton}
                />
                <Button
                  onPress={methods.handleSubmit(onSubmit, onError)}
                  title={PT_BR.ADD_TRIP_FORM.SUBMIT}
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

export default AddTripBottomSheet;
