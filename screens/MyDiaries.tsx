import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FAB, Icon, ListItem, Text, makeStyles } from "@rneui/themed";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { z } from "zod";

import { RootStackParamList } from "../App";
import AddDiaryEntryBottomSheet from "../components/AddDiaryEntryBottomSheet";
import RemoveDiaryEntryDialog from "../components/RemoveDiaryEntryDialog";
import UpdateDiaryEntryBottomSheet from "../components/UpdateDiaryEntryBottomSheet";
import PT_BR from "../lang/pt-br";
import useGetDiaries from "../providers/diaries";

const getDiarySchema = z.object({
  id: z.number(),
  tripId: z.number(),
  date: z.date(),
  description: z.string(),
  location: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type getDiaryData = z.infer<typeof getDiarySchema>;
type Props = NativeStackScreenProps<RootStackParamList, "MyDiaries">;

function MyDiaries({ route }: Props) {
  const styles = useStyles();

  const [isAddDiaryModalVisible, setIsAddDiaryModalVisible] = useState(false);
  const [removeDiaryId, setRemoveDiaryId] = useState<number | null>(null);
  const [isRemoveTripDialogVisible, setIsRemoveTripDialogVisible] =
    useState(false);
  const [updateTripId, setUpdateTripId] = useState<number | null>(null);
  const [isUpdateTripModalVisible, setIsUpdateTripModalVisible] =
    useState(false);

  const token = route.params?.token || "";
  const tripId = route.params?.tripId || 0;

  const {
    data: diaryData,
    isLoading: isLoadingDiary,
    refetch: refetchDiaries,
  } = useGetDiaries(token, tripId);

  const reloadAfterAdd = () => {
    setIsAddDiaryModalVisible(false);
    refetchDiaries();
  };

  const triggerDeleteModal = (onClose: () => void, id: number) => {
    setIsRemoveTripDialogVisible(true);
    setRemoveDiaryId(id);
    onClose();
  };

  const reloadAfterRemoval = () => {
    setIsRemoveTripDialogVisible(false);
    setRemoveDiaryId(null);

    refetchDiaries();
  };

  const triggerUpdateModal = (onClose: () => void, id: number) => {
    setIsUpdateTripModalVisible(true);
    setUpdateTripId(id);
    onClose();
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!isLoadingDiary &&
          diaryData?.map((diary: getDiaryData) => (
            <ListItem.Swipeable
              key={diary.id}
              rightContent={(reset) => (
                <Button
                  title={PT_BR.MY_DIARIES.DELETE}
                  onPress={() => triggerDeleteModal(reset, diary.id)}
                  icon={{ name: "delete", color: "white" }}
                  buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                />
              )}
              leftContent={(reset) => (
                <Button
                  title={PT_BR.MY_DIARIES.EDIT}
                  onPress={() => triggerUpdateModal(reset, diary.id)}
                  icon={{ name: "edit", color: "white" }}
                  buttonStyle={{ minHeight: "100%", backgroundColor: "blue" }}
                />
              )}
            >
              <Icon type="simple-line-icon" name="direction" />
              <ListItem.Content>
                <ListItem.Title style={{ paddingBottom: 3 }}>
                  {diary.location}
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>{`${PT_BR.MY_DIARIES.FROM} ${new Date(
                    diary.date,
                  ).toLocaleDateString("pt-BR")}`}</Text>
                </ListItem.Subtitle>
                <ListItem.Subtitle>
                  <Text>{diary.description}</Text>
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
          title={PT_BR.MY_DIARIES.ADD}
          size="small"
          color="green"
          onPress={() => setIsAddDiaryModalVisible(true)}
        />
      </View>

      <AddDiaryEntryBottomSheet
        isVisible={isAddDiaryModalVisible}
        onClose={() => reloadAfterAdd()}
        tripId={tripId}
        token={token}
      />

      <RemoveDiaryEntryDialog
        isVisible={isRemoveTripDialogVisible}
        onClose={() => reloadAfterRemoval()}
        diaryId={removeDiaryId ?? 0}
        tripId={tripId}
        token={token}
      />
      <UpdateDiaryEntryBottomSheet
        isVisible={isUpdateTripModalVisible}
        onClose={() => {
          setIsUpdateTripModalVisible(false);
          setUpdateTripId(null);
        }}
        diaryId={updateTripId ?? 0}
        tripId={tripId}
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

export default MyDiaries;
