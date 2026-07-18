import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AddPatientScreen from '../screens/AddPatientScreen';
import EditPatientScreen from '../screens/EditPatientScreen';
import colors from '../styles/colors';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Login - Sin header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />

        {/* Home - Con header pero sin botón de volver */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '🏥 BioCare',
            headerLeft: null, // Oculta el botón de volver
          }}
        />

        {/* Agregar paciente */}
        <Stack.Screen
          name="AddPatient"
          component={AddPatientScreen}
          options={{
            title: 'Agregar Paciente',
          }}
        />

        {/* Editar paciente */}
        <Stack.Screen
          name="EditPatient"
          component={EditPatientScreen}
          options={{
            title: 'Editar Paciente',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;