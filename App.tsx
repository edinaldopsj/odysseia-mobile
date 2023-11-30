import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  MyTrips: {
    token: string;
  };
  MyDiaries: {
    token: string;
    tripId: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
