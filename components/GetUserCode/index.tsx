import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Input } from "@rneui/base";
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

const getUserCodeSchema = z.object({
  code: z.string().min(6, PT_BR.VALIDATION.CODE),
});

export type getUserCodeData = z.infer<typeof getUserCodeSchema>;

function GetUserCodeForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: SubmitHandler<getUserCodeData>;
  onCancel: () => void;
}) {
  const inputStyle = useInputStyle();

  const methods = useForm<getUserCodeData>({
    resolver: zodResolver(getUserCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<getUserCodeData> = (data) => onSuccess(data);

  const onError: SubmitErrorHandler<getUserCodeData> = (errors) => {
    Alert.alert("Warning", getReadableValidationErrorMessage(errors));
  };

  return (
    <FormProvider {...methods}>
      <Controller
        control={methods.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label={PT_BR.CREATE_USER_FORM.CODE}
            placeholder={PT_BR.CREATE_USER_FORM.CODE_PLACEHOLDER}
            errorStyle={{ color: "red" }}
            errorMessage={error?.message && PT_BR.VALIDATION.CODE}
            value={value}
            onChangeText={(text) => onChange(text)}
            inputContainerStyle={inputStyle.inputContainer}
            inputStyle={inputStyle.input}
          />
        )}
        name="code"
      />

      <View style={{ paddingHorizontal: 30 }}>
        <Button
          onPress={methods.handleSubmit(onSubmit, onError)}
          title={PT_BR.CREATE_USER_FORM.SUBMIT_CODE}
        />
        <Divider style={{ paddingTop: 5 }} />
        <Button
          onPress={() => onCancel()}
          title={PT_BR.CREATE_USER_FORM.CANCEL}
        />
      </View>
    </FormProvider>
  );
}

export default GetUserCodeForm;
