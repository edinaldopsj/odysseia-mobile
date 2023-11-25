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

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function Home({ navigation }: Props) {
  const [hasEmail, setHasEmail] = useState(false);

  const styles = useStyles();
  const onCreateUserFormSuccess = (data: createUserFormData) => {
    console.log({ data });

    setHasEmail(true);
  };

  const onGetUserCodeFormSuccess = (data: getUserCodeData) => {
    console.log({ data });
    navigation.navigate("MyTrips");
  };

  const onCancelCodeSubmit = () => {
    setHasEmail(false);
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
