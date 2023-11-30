import { Dialog, Text } from "@rneui/themed";
import { ToastAndroid } from "react-native";

import PT_BR from "../../lang/pt-br";
import { removeDiary } from "../../providers/diaries";

type Props = {
  diaryId: number;
  token: string;
  tripId: number;
  isVisible: boolean;
  onClose: () => void;
};

function RemoveDiaryEntryDialog({
  isVisible,
  diaryId,
  tripId,
  token,
  onClose,
}: Props) {
  const removeDiaryFn = async () => {
    const hasRemovedDiary = await removeDiary(tripId, diaryId, token);

    if (hasRemovedDiary) {
      ToastAndroid.show(
        PT_BR.REMOVE_DIARY_ENTRY_DIALOG.SUCCESS,
        ToastAndroid.SHORT,
      );
      onClose();
    }
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={() => onClose()}>
      <Dialog.Title title={PT_BR.REMOVE_DIARY_ENTRY_DIALOG.TITLE} />
      <Text>{PT_BR.REMOVE_DIARY_ENTRY_DIALOG.MESSAGE}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title={PT_BR.REMOVE_DIARY_ENTRY_DIALOG.YES}
          onPress={() => removeDiaryFn()}
        />
        <Dialog.Button
          title={PT_BR.REMOVE_DIARY_ENTRY_DIALOG.NO}
          onPress={() => onClose()}
        />
      </Dialog.Actions>
    </Dialog>
  );
}

export default RemoveDiaryEntryDialog;
