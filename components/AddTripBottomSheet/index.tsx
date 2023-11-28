import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import {
  BottomSheet,
  Button,
  Divider,
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
import { Alert, View } from "react-native";
import { z } from "zod";

import PT_BR from "../../lang/pt-br";
import { useInputStyle } from "../../styles/inputs";
import { getReadableValidationErrorMessage } from "../../utils/forms";

type Props = {
  isVisible: boolean;
};

const createTripFormSchema = z.object({
  destination: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["CREATED", "INPROGRESS", "FINISHED"]),
});

export type createTripFormData = z.infer<typeof createTripFormSchema>;

function AddTripBottomSheet({ isVisible }: Props) {
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

  const onSubmit: SubmitHandler<createTripFormData> = (
    data: createTripFormData,
  ) => console.log({ data });

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
              <Divider style={styles.divider} />
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
              <Divider style={styles.divider} />
              <Button
                onPress={methods.handleSubmit(onSubmit, onError)}
                title={PT_BR.ADD_TRIP_FORM.SUBMIT}
                style={styles.submitButton}
              />
            </View>
          </FormProvider>
        </View>
      </BottomSheet>
    </>
  );
}

const useStyles = makeStyles(() => ({
  bottomSheet: { backgroundColor: "white", padding: 16 },
  divider: { paddingVertical: 1 },
  textTitle: { paddingBottom: 10 },
  buttonArea: { paddingHorizontal: 10 },
  dateButtonArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    paddingTop: 15,
  },
}));

export default AddTripBottomSheet;
