import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createTheme, ThemeProvider } from "@rneui/themed";
import React from "react";

import PT_BR from "./lang/pt-br";
import Home from "./screens/Home";
import MyDiaries from "./screens/MyDiaries";
import MyTrips from "./screens/MyTrips";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export type RootStackParamList = {
  Home: undefined;
  MyTrips: undefined;
  MyDiaries: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={Home}
          />
          <Stack.Screen
            name="MyTrips"
            component={MyTrips}
            options={{
              headerTitle: PT_BR.SCREENS.MY_TRIPS,
            }}
          />
          <Stack.Screen
            name="MyDiaries"
            component={MyDiaries}
            options={{
              headerTitle: PT_BR.SCREENS.MY_DIARIES,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
