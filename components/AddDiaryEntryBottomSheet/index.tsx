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
import { addDiary } from "../../providers/diaries";
import { useInputStyle } from "../../styles/inputs";
import { getReadableValidationErrorMessage } from "../../utils/forms";

type Props = {
  isVisible: boolean;
  tripId: number;
  token: string;
  onClose: () => void;
};

const createDiaryEntryFormSchema = z.object({
  location: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
  description: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
  date: z.date(),
});

export type createDiaryEntryFormData = z.infer<
  typeof createDiaryEntryFormSchema
>;

function AddDiaryEntryBottomSheet({
  isVisible,
  tripId,
  token,
  onClose,
}: Props) {
  const styles = useStyles();
  const inputStyle = useInputStyle();

  const methods = useForm<createDiaryEntryFormData>({
    resolver: zodResolver(createDiaryEntryFormSchema),
    defaultValues: {
      location: "",
      description: "",
      date: new Date(),
    },
  });

  const watchDate = methods.watch("date");

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: watchDate,
      onChange: (_, selectedDate) => {
        const currentDate = selectedDate || watchDate;
        methods.setValue("date", currentDate);
      },
    });
  };

  const onError: SubmitErrorHandler<createDiaryEntryFormData> = (errors, e) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  const onSubmit: SubmitHandler<createDiaryEntryFormData> = async (
    data: createDiaryEntryFormData,
  ) => {
    const hasAddedDiaryEntry = await addDiary(data, tripId, token);

    if (hasAddedDiaryEntry) {
      ToastAndroid.show(PT_BR.ADD_DIARY_ENTRY_FORM.SUCCESS, ToastAndroid.SHORT);
      onClose();
    }
  };

  const closeModal = () => {
    methods.reset({
      location: "",
      description: "",
      date: new Date(),
    });
    onClose();
  };

  return (
    <>
      <BottomSheet isVisible={isVisible}>
        <View style={styles.bottomSheet}>
          <Text style={styles.textTitle} h4>
            {PT_BR.ADD_DIARY_ENTRY_FORM.TITLE}
          </Text>

          <FormProvider {...methods}>
            <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label={PT_BR.ADD_DIARY_ENTRY_FORM.LOCATION}
                  placeholder={PT_BR.ADD_DIARY_ENTRY_FORM.LOCATION_PLACEHOLDER}
                  errorStyle={{ color: "red" }}
                  errorMessage={error?.message && PT_BR.VALIDATION.NOT_EMPTY}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  inputStyle={inputStyle.input}
                  inputContainerStyle={inputStyle.inputContainer}
                />
              )}
              name="location"
            />
            <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label={PT_BR.ADD_DIARY_ENTRY_FORM.DESCRIPTION}
                  placeholder={
                    PT_BR.ADD_DIARY_ENTRY_FORM.DESCRIPTION_PLACEHOLDER
                  }
                  errorStyle={{ color: "red" }}
                  errorMessage={error?.message && PT_BR.VALIDATION.NOT_EMPTY}
                  value={value}
                  onChangeText={(text) => onChange(text)}
                  inputStyle={inputStyle.input}
                  inputContainerStyle={inputStyle.inputContainer}
                />
              )}
              name="description"
            />
            <View style={styles.buttonArea}>
              <View style={styles.dateButtonArea}>
                <Button
                  onPress={() => showDatePicker()}
                  title={
                    <Icon color="#FFF" type="ionicon" name="calendar-outline" />
                  }
                />
                <Text>{`  ${
                  PT_BR.ADD_DIARY_ENTRY_FORM.WHEN_TO
                } ${watchDate.toLocaleDateString("pt-BR")}`}</Text>
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

export default AddDiaryEntryBottomSheet;
