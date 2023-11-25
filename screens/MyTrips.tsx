import { Button, FAB, Icon, ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AddTripBottomSheet from "../components/AddTripBottomSheet";
import PT_BR from "../lang/pt-br";

function MyTrips() {
  const styles = useStyles();
  const [isAddTripModalVisible, setIsAddTripModalVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ListItem.Swipeable
          leftContent={(reset) => (
            <Button
              title={PT_BR.MY_TRIPS.INFO}
              onPress={() => reset()}
              icon={{ name: "info", color: "white" }}
              buttonStyle={{ minHeight: "100%" }}
            />
          )}
          rightContent={(reset) => (
            <Button
              title={PT_BR.MY_TRIPS.DELETE}
              onPress={() => reset()}
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

      <AddTripBottomSheet isVisible={isAddTripModalVisible} />
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
