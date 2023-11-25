import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@rneui/base";
import React from "react";
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

const createUserFormSchema = z.object({
  email: z
    .string()
    .min(1, PT_BR.VALIDATION.EMAIL)
    .email(PT_BR.VALIDATION.EMAIL),
});

export type createUserFormData = z.infer<typeof createUserFormSchema>;

function CreateUserForm({
  onSuccess,
}: {
  onSuccess: SubmitHandler<createUserFormData>;
}) {
  const inputStyle = useInputStyle();

  const methods = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<createUserFormData> = (data) => onSuccess(data);

  const onError: SubmitErrorHandler<createUserFormData> = (errors, e) => {
    // console.log(JSON.stringify(errors));
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  return (
    <FormProvider {...methods}>
      <Controller
        control={methods.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label={PT_BR.CREATE_USER_FORM.EMAIL}
            placeholder={PT_BR.CREATE_USER_FORM.EMAIL_PLACEHOLDER}
            errorStyle={{ color: "red" }}
            errorMessage={error?.message && PT_BR.VALIDATION.EMAIL}
            value={value}
            onChangeText={(text) => onChange(text)}
            inputStyle={inputStyle.input}
            inputContainerStyle={inputStyle.inputContainer}
          />
        )}
        name="email"
      />

      <View style={{ paddingHorizontal: 30 }}>
        <Button
          onPress={methods.handleSubmit(onSubmit, onError)}
          title={PT_BR.CREATE_USER_FORM.SUBMIT}
        />
      </View>
    </FormProvider>
  );
}

export default CreateUserForm;
