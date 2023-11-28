import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FAB, Icon, ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootStackParamList } from "../App";
import AddTripBottomSheet from "../components/AddTripBottomSheet";
import RemoveTripDialog from "../components/RemoveTripDialog";
import PT_BR from "../lang/pt-br";

type Props = NativeStackScreenProps<RootStackParamList, "MyTrips">;

function MyTrips({ navigation }: Props) {
  const styles = useStyles();

  const [isAddTripModalVisible, setIsAddTripModalVisible] = useState(false);
  const [isRemoveTripDialogVisible, setIsRemoveTripDialogVisible] =
    useState(false);

  const triggerDeleteModal = (onClose: () => void) => {
    setIsRemoveTripDialogVisible(true);
    onClose();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ListItem.Swipeable
          leftContent={(reset) => (
            <Button
              title={PT_BR.MY_TRIPS.INFO}
              onPress={() => navigation.navigate("MyDiaries")}
              icon={{ name: "info", color: "white" }}
              buttonStyle={{ minHeight: "100%" }}
            />
          )}
          rightContent={(reset) => (
            <Button
              title={PT_BR.MY_TRIPS.DELETE}
              onPress={() => triggerDeleteModal(reset)}
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
            />
          )}
        >
          <Icon type="ionicon" name="airplane" />
          <ListItem.Content>
            <ListItem.Title style={{ paddingBottom: 3 }}>
              Santa Caralha do Norte
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text>De: 24/09/2023 | Até: 24/10/2023</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      </View>
      <View style={styles.bottomButtonContainer}>
        <FAB
          icon={{
            name: "paper-plane",
            color: "white",
            type: "entypo",
          }}
          title={PT_BR.MY_TRIPS.ADD}
          size="small"
          color="green"
          onPress={() => setIsAddTripModalVisible(true)}
        />
      </View>

      <AddTripBottomSheet
        isVisible={isAddTripModalVisible}
        onClose={() => setIsAddTripModalVisible(false)}
      />

      <RemoveTripDialog
        isVisible={isRemoveTripDialogVisible}
        onClose={() => setIsRemoveTripDialogVisible(false)}
        tripId="123"
      />
    </SafeAreaProvider>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 12,
  },
}));

export default MyTrips;
