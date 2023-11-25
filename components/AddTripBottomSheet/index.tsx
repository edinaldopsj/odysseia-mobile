import { zodResolver } from "@hookform/resolvers/zod";
import { BottomSheet, Button, Input, Text } from "@rneui/themed";
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

  const onError: SubmitErrorHandler<createTripFormData> = (errors, e) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  const onSubmit: SubmitHandler<createTripFormData> = (
    data: createTripFormData,
  ) => console.log({ data });

  return (
    <>
      <BottomSheet isVisible={isVisible}>
        <View style={{ backgroundColor: "white", padding: 16 }}>
          <Text style={{ paddingBottom: 10 }} h4>
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

            {/* <Controller
              control={methods.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => <DatePicker date={new Date()} onDateChange={onChange} />}
              name="destination"
            /> */}

            <View style={{ paddingHorizontal: 30 }}>
              <Button
                onPress={methods.handleSubmit(onSubmit, onError)}
                title={PT_BR.ADD_TRIP_FORM.SUBMIT}
              />
            </View>
          </FormProvider>
        </View>
      </BottomSheet>
    </>
  );
}

export default AddTripBottomSheet;
