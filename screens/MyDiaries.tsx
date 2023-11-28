import { Button, FAB, Icon, ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AddTripBottomSheet from "../components/AddTripBottomSheet";
import RemoveTripDialog from "../components/RemoveTripDialog";
import PT_BR from "../lang/pt-br";

function MyDiaries() {
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
              title={PT_BR.MY_DIARIES.INFO}
              onPress={() => reset()}
              icon={{ name: "info", color: "white" }}
              buttonStyle={{ minHeight: "100%" }}
            />
          )}
          rightContent={(reset) => (
            <Button
              title={PT_BR.MY_DIARIES.DELETE}
              onPress={() => triggerDeleteModal(reset)}
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
            />
          )}
        >
          <Icon type="simple-line-icon" name="direction" />
          <ListItem.Content>
            <ListItem.Title style={{ paddingBottom: 3 }}>
              Mirante do Bosteiro
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
          title={PT_BR.MY_DIARIES.ADD}
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

export default MyDiaries;
