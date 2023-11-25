import { makeStyles } from "@rneui/themed";

export const useInputStyle = makeStyles(() => ({
  inputContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginTop: 5,
  },
  input: {
    paddingHorizontal: 10,
  },
}));
