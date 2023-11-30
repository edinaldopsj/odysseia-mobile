import { Dialog, Text } from "@rneui/themed";
import { ToastAndroid } from "react-native";

import PT_BR from "../../lang/pt-br";
import { removeTrip } from "../../providers/trips";

type Props = {
  tripId: number;
  isVisible: boolean;
  token: string;
  onClose: () => void;
};

function RemoveTripDialog({ isVisible, tripId, token, onClose }: Props) {
  const removeTripFn = async () => {
    const hasRemovedTrip = await removeTrip(tripId, token);

    if (hasRemovedTrip) {
      ToastAndroid.show(PT_BR.REMOVE_TRIP_DIALOG.SUCCESS, ToastAndroid.SHORT);
      onClose();
    }
  };

  return (
    <Dialog isVisible={isVisible} onBackdropPress={() => onClose()}>
      <Dialog.Title title={PT_BR.REMOVE_TRIP_DIALOG.TITLE} />
      <Text>{PT_BR.REMOVE_TRIP_DIALOG.MESSAGE}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title={PT_BR.REMOVE_TRIP_DIALOG.YES}
          onPress={() => removeTripFn()}
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
