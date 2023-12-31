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
import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Alert, Image, ToastAndroid, View } from "react-native";
import { z } from "zod";

import PT_BR from "../../lang/pt-br";
import {
  updateDiary,
  updateDiaryImage,
  useGetDiaryById,
} from "../../providers/diaries";
import { useInputStyle } from "../../styles/inputs";
import { getReadableValidationErrorMessage } from "../../utils/forms";

type Props = {
  isVisible: boolean;
  tripId: number;
  diaryId: number;
  token: string;
  onClose: () => void;
};

const updateDiaryEntryFormSchema = z.object({
  location: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
  description: z.string().min(1, PT_BR.VALIDATION.NOT_EMPTY),
  date: z.date(),
  imgUrl: z.any().optional(),
});

export type updateDiaryEntryFormData = z.infer<
  typeof updateDiaryEntryFormSchema
>;

function UpdateDiaryEntryBottomSheet({
  isVisible,
  tripId,
  diaryId,
  token,
  onClose,
}: Props) {
  const styles = useStyles();
  const inputStyle = useInputStyle();

  const [id, setId] = useState<number>(0);
  const [imageUri, setImageUri] = useState<string>("");
  const [defaultValues] = useState<updateDiaryEntryFormData>({
    location: "",
    description: "",
    date: new Date(),
    imgUrl: "",
  });

  const { data: diaryData, isLoading: isLoadingDiary } = useGetDiaryById(
    tripId,
    diaryId,
    token,
  );

  const methods = useForm<updateDiaryEntryFormData>({
    resolver: zodResolver(updateDiaryEntryFormSchema),
    defaultValues,
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

  const onError: SubmitErrorHandler<updateDiaryEntryFormData> = (errors, e) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  const closeModal = () => {
    methods.reset({
      location: "",
      description: "",
      date: new Date(),
    });
    onClose();
  };

  const handleDocumentSelection = useCallback(async (id: number) => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: false,
      });

      if (response.type === "success") {
        const file = {
          uri: response.uri,
          type: response.mimeType,
          name: response.name,
        };

        setImageUri(response.uri);

        const hasUploadedImage = await updateDiaryImage(
          tripId,
          id, // diaryId
          token,
          file,
        );

        if (hasUploadedImage) {
          ToastAndroid.show(
            PT_BR.UPDATE_DIARY_ENTRY_FORM.IMAGE_UPDATED,
            ToastAndroid.SHORT,
          );
        } else {
          ToastAndroid.show(
            PT_BR.UPDATE_DIARY_ENTRY_FORM.IMAGE_NOT_UPDATED,
            ToastAndroid.SHORT,
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onSubmit: SubmitHandler<updateDiaryEntryFormData> = async (
    data: updateDiaryEntryFormData,
  ) => {
    const hasUpdatedDiary = await updateDiary(diaryId, tripId, data, token);

    if (hasUpdatedDiary) {
      ToastAndroid.show(
        PT_BR.UPDATE_DIARY_ENTRY_FORM.SUCCESS,
        ToastAndroid.SHORT,
      );
      onClose();
    }
  };

  useEffect(() => {
    setId(diaryId);
  }, [diaryId]);

  useEffect(() => {
    if (diaryData) {
      methods.setValue("location", diaryData.location);
      methods.setValue("description", diaryData.description);
      methods.setValue("date", new Date(diaryData.date));

      setImageUri(diaryData.imgUrl ?? "");
    }
  }, [diaryData, isLoadingDiary]);

  return (
    <>
      <BottomSheet isVisible={isVisible}>
        <View style={styles.bottomSheet}>
          <Text style={styles.textTitle} h4>
            {PT_BR.UPDATE_DIARY_ENTRY_FORM.TITLE}
          </Text>

          <FormProvider {...methods}>
            <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  label={PT_BR.UPDATE_DIARY_ENTRY_FORM.LOCATION}
                  placeholder={
                    PT_BR.UPDATE_DIARY_ENTRY_FORM.LOCATION_PLACEHOLDER
                  }
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
                  label={PT_BR.UPDATE_DIARY_ENTRY_FORM.DESCRIPTION}
                  placeholder={
                    PT_BR.UPDATE_DIARY_ENTRY_FORM.DESCRIPTION_PLACEHOLDER
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
                  PT_BR.UPDATE_DIARY_ENTRY_FORM.WHEN_TO
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

              {!imageUri ? (
                <Button
                  title={PT_BR.UPDATE_DIARY_ENTRY_FORM.ADD_IMAGE}
                  onPress={() => handleDocumentSelection(id)}
                  style={{ paddingTop: 5 }}
                />
              ) : (
                <>
                  <Image
                    source={{
                      uri: imageUri,
                    }}
                    style={{ width: "100%", height: 150 }}
                  />
                  <Button
                    title={PT_BR.UPDATE_DIARY_ENTRY_FORM.REMOVE_IMAGE}
                    style={{ paddingTop: 5 }}
                    onPress={() => setImageUri("")}
                  />
                </>
              )}
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
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    marginVertical: 15,
  },
}));

export default UpdateDiaryEntryBottomSheet;
