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
import { loadRecipePreference } from './Features/Recipe/RecipeSlice';
import RecipeHeader from './Features/Recipe/Components/RecipeHeader';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeDetails } from './Features/Recipe/Components/RecipeDetails';

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

export type ScreenNames = ["Details"];
export type RootStackParamList = Record<ScreenNames[number], undefined>;
export type StackNavigation = NavigationProp<RootStackParamList>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const dispatch = useAppDispatch();

  dispatch(fetchConfig());
  dispatch(loadRecipePreference());
  
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
            <Tab.Screen name="Home" 
              options={{  tabBarShowLabel: true,
                          tabBarActiveTintColor: theme.colors.primary,
                          tabBarIcon: () => ( <MaterialCommunityIcons name="food" color={theme.colors.primary} size={26} /> ),
                        }} component={RecipeHeader}
            >
            </Tab.Screen>
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
