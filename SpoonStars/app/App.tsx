/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {   
          PaperProvider, 
          MD3LightTheme as defaultTheme, 
          useTheme} 
      from 'react-native-paper';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PropsWithChildren} from 'react';
import {
  StatusBar,
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch } from './Redux/Hooks';
import { fetchConfig } from './Features/Configuration/ConfigSlice';
import { loadRecipePreference } from './Features/Recipe/Scripts/RecipeSlice';
import RecipeHeader from './Features/Recipe/Components/RecipeHeader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeDetails from './Features/Recipe/Components/RecipeDetails';
import { RootStackParamList } from './../types/App_Types';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: 'darkseagreen',
    secondary: 'yellow',
    secondaryContainer: 'white'
  },
  
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();

export type ScreenNames = ["Home", "Details"];


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const dispatch = useAppDispatch();

  dispatch(fetchConfig());
  dispatch(loadRecipePreference());
  
  const RecipeTab = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen 
          name='Home'
          component={RecipeHeader}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name='Details'
          component={RecipeDetails}
          initialParams={{ id: 'testid' }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={ theme }>
        <Tab.Navigator initialRouteName='Home' screenOptions={
              { headerShown: true, headerStyle: {
                backgroundColor: theme.colors.primary,
                shadowColor: 'transparent',
                height: StatusBar.currentHeight
              }, headerTitle:'' }
            }>
            <Tab.Screen name="HomeTab" 
              options={{  tabBarShowLabel: false,
                          tabBarActiveTintColor: theme.colors.primary,
                          tabBarIcon: () => ( <MaterialCommunityIcons name="food" color={theme.colors.primary} size={26} /> ),
                        }} component={RecipeTab}
            >
            </Tab.Screen>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
