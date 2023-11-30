// import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { makeStyles, Text } from "@rneui/themed";
import React, { useState } from "react";
import { View } from "react-native";

import { RootStackParamList } from "../App";
import CreateUserForm, {
  createUserFormData,
} from "../components/CreateUserForm";
import GetUserCodeForm, { getUserCodeData } from "../components/GetUserCode";
import PT_BR from "../lang/pt-br";
import { createCodeToken, validateCodeToken } from "../providers/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function Home({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState(false);

  const styles = useStyles();
  const onCreateUserFormSuccess = async (data: createUserFormData) => {
    const token = (await AsyncStorage.getItem("@token")) || "";

    if (token) {
      navigation.navigate("MyTrips", {
        token,
      });
    }

    const hasSentEmail = await createCodeToken(data.email);

    if (hasSentEmail?.success) {
      setEmail(data.email);
      setHasEmail(true);
    }
  };

  const onGetUserCodeFormSuccess = async (data: getUserCodeData) => {
    if (email && data.code) {
      const hasReceivedCode = await validateCodeToken(data.code, email);

      if (hasReceivedCode?.data?.token) {
        await AsyncStorage.setItem("@token", hasReceivedCode?.data?.token);

        navigation.navigate("MyTrips", {
          token: hasReceivedCode?.data?.token,
        });
      }
    }
  };

  const onCancelCodeSubmit = () => {
    setHasEmail(false);
    setEmail("");
  };

  return (
    <View style={styles.container}>
      <Text h3>{PT_BR.HOME.TITLE} </Text>
      <Text style={styles.text}>{PT_BR.HOME.SUBTITLE} </Text>

      <View style={styles.formContainer}>
        {!hasEmail && <CreateUserForm onSuccess={onCreateUserFormSuccess} />}
        {hasEmail && (
          <GetUserCodeForm
            onSuccess={onGetUserCodeFormSuccess}
            onCancel={onCancelCodeSubmit}
          />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    paddingTop: 35,
    width: "85%",
    paddingHorizontal: theme.spacing.lg,
  },
  text: {
    marginVertical: theme.spacing.lg,
    paddingHorizontal: 45,
  },
}));

export default Home;
