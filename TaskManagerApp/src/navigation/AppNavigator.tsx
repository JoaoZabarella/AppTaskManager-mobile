import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';

export type AppStackParamList = {
  Home: undefined;
  TaskList: undefined;
  TaskDetail: { taskId: number };
  CreateTask: undefined;
  EditTask: { taskId: number };
  Categories: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}