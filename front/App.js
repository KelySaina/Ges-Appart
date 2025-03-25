import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import AddEditScreen from "./screens/AddEditScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Liste des appartements" component={HomeScreen} />
        <Stack.Screen
          name="Administrer un Appartement"
          component={AddEditScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
