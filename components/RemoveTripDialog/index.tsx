import { Dialog, Text } from "@rneui/themed";

import PT_BR from "../../lang/pt-br";

type Props = {
  tripId: string;
  isVisible: boolean;
  onClose: () => void;
};

function RemoveTripDialog({ isVisible, onClose }: Props) {
  return (
    <Dialog isVisible={isVisible} onBackdropPress={() => onClose()}>
      <Dialog.Title title="Dialog Title" />
      <Text>{PT_BR.REMOVE_TRIP_DIALOG.TITLE}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title={PT_BR.REMOVE_TRIP_DIALOG.YES}
          onPress={() => console.log("Primary Action Clicked!")}
        />
        <Dialog.Button
          title={PT_BR.REMOVE_TRIP_DIALOG.NO}
          onPress={() => onClose()}
        />
      </Dialog.Actions>
    </Dialog>
  );
}

export default RemoveTripDialog;
