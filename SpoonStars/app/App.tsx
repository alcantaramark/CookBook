/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {   
          PaperProvider, 
          MD3LightTheme as defaultTheme, 
          useTheme} 
      from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
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
import RecipeMain from './Features/Recipe/Components/RecipeMain';
import Search from './components/Search/Search';
import Plan from './components/Plan/Plan';
import { useAppDispatch } from './Redux/Hooks';
import { fetchConfig } from './Features/Configuration/ConfigSlice';
import { loadRecipePreferences } from './Features/Recipe/RecipeSlice';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: 'darkseagreen',
    secondary: 'yellow',
  },
  
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const dispatch = useAppDispatch();

  dispatch(fetchConfig());
  dispatch(loadRecipePreferences());

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
                        }} component={RecipeMain}
            />
            <Tab.Screen name="Search" 
              options={{  tabBarShowLabel: true,
                          tabBarActiveTintColor: theme.colors.primary,
                          tabBarIcon: () => ( <MaterialCommunityIcons name="clipboard-text-search-outline" color={theme.colors.primary} size={26} /> )
                        }} component={Search}
            />
            <Tab.Screen name="Plan" 
              options={{  tabBarShowLabel: true,
                          tabBarActiveTintColor: theme.colors.primary,
                          tabBarIcon: () => ( <MaterialCommunityIcons name="calendar-check" color={theme.colors.primary} size={26} /> )
                        }} component={Plan}
            />          
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
