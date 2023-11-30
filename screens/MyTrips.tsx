import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FAB, Icon, ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z } from "zod";

import { RootStackParamList } from "../App";
import AddTripBottomSheet from "../components/AddTripBottomSheet";
import RemoveTripDialog from "../components/RemoveTripDialog";
import UpdateTripBottomSheet from "../components/UpdateTripBottomSheet";
import PT_BR from "../lang/pt-br";
import useGetTrips from "../providers/trips";

const getTripSchema = z.object({
  id: z.number(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  destination: z.string(),
  endDate: z.string(),
  startDate: z.string(),
  status: z.enum(["CREATED", "INPROGRESS", "FINISHED"]),
});

type Props = NativeStackScreenProps<RootStackParamList, "MyTrips">;
export type getTripData = z.infer<typeof getTripSchema>;

function MyTrips({ navigation, route }: Props) {
  const styles = useStyles();

  const [isAddTripModalVisible, setIsAddTripModalVisible] = useState(false);
  const [isUpdateTripModalVisible, setIsUpdateTripModalVisible] =
    useState(false);
  const [updateTripId, setUpdateTripId] = useState<number | null>(null);
  const [removeTripId, setRemoveTripId] = useState<number | null>(null);
  const [isRemoveTripDialogVisible, setIsRemoveTripDialogVisible] =
    useState(false);

  const token = route.params?.token || "";
  const {
    data: tripData,
    isLoading: isLoadingTrip,
    refetch: refetchTrips,
  } = useGetTrips(token);

  const triggerUpdateModal = (id: number) => {
    console.log({ id });

    setUpdateTripId(id);
    setIsUpdateTripModalVisible(true);
  };

  const triggerDeleteModal = (onClose: () => void, id: number) => {
    setIsRemoveTripDialogVisible(true);
    setRemoveTripId(id);
    onClose();
  };

  const reloadAfterAdd = () => {
    setIsAddTripModalVisible(false);
    refetchTrips();
  };

  const reloadAfterUpdate = () => {
    setIsUpdateTripModalVisible(false);
    setUpdateTripId(null);

    refetchTrips();
  };

  const reloadAfterRemoval = () => {
    setIsRemoveTripDialogVisible(false);
    setRemoveTripId(null);

    refetchTrips();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!isLoadingTrip &&
          tripData?.map((trip: getTripData) => (
            <ListItem.Swipeable
              key={trip.id}
              onLongPress={() => {
                triggerUpdateModal(trip.id);
              }}
              leftContent={() => (
                <Button
                  title={PT_BR.MY_TRIPS.INFO}
                  onPress={() =>
                    navigation.navigate("MyDiaries", {
                      tripId: trip.id,
                      token,
                    })
                  }
                  icon={{ name: "info", color: "white" }}
                  buttonStyle={{ minHeight: "100%" }}
                />
              )}
              rightContent={(reset) => (
                <Button
                  title={PT_BR.MY_TRIPS.DELETE}
                  onPress={() => triggerDeleteModal(reset, trip?.id)}
                  icon={{ name: "delete", color: "white" }}
                  buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                />
              )}
            >
              <Icon type="ionicon" name="airplane" />
              <ListItem.Content>
                <ListItem.Title style={{ paddingBottom: 3 }}>
                  {trip?.destination ?? PT_BR.MY_TRIPS.NO_DESTINATION}
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>{`${PT_BR.MY_TRIPS.FROM}: ${new Date(
                    trip?.startDate,
                  ).toLocaleDateString("pt-BR")} | ${
                    PT_BR.MY_TRIPS.TO
                  }: ${new Date(trip?.endDate).toLocaleDateString(
                    "pt-BR",
                  )}`}</Text>
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          ))}
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
        onClose={() => reloadAfterAdd()}
        token={token}
      />

      <UpdateTripBottomSheet
        isVisible={isUpdateTripModalVisible}
        onClose={() => reloadAfterUpdate()}
        tripId={updateTripId ?? 0}
        token={token}
      />

      <RemoveTripDialog
        isVisible={isRemoveTripDialogVisible}
        onClose={() => reloadAfterRemoval()}
        tripId={removeTripId ?? 0}
        token={token}
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
