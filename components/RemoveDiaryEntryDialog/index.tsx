import { Dialog, Text } from "@rneui/themed";

import PT_BR from "../../lang/pt-br";

type Props = {
  tripId: string;
  isVisible: boolean;
  onClose: () => void;
};

function RemoveDiaryEntryDialog({ isVisible, onClose }: Props) {
  return (
    <Dialog isVisible={isVisible} onBackdropPress={() => onClose()}>
      <Dialog.Title title={PT_BR.REMOVE_DIARY_ENTRY_DIALOG.TITLE} />
      <Text>{PT_BR.REMOVE_DIARY_ENTRY_DIALOG.MESSAGE}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title={PT_BR.REMOVE_DIARY_ENTRY_DIALOG.YES}
          onPress={() => console.log("Primary Action Clicked!")}
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
