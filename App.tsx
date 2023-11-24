import { createTheme, ThemeProvider } from "@rneui/themed";
import React from "react";

import Home from "./screens/Home";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}
