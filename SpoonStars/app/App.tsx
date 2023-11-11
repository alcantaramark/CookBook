/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {  } from 'react';
import {   
          PaperProvider, 
          MD3LightTheme as defaultTheme } 
      from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunitIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PropsWithChildren} from 'react';
import Header from './components/Header/Header';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { runCLI } from 'jest';
import Home from './Features/SearchRecipe/Components/Home';
import Search from './components/Search/Search';
import Plan from './components/Plan/Plan';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  

  return (
    <NavigationContainer>
      <PaperProvider theme={ theme }>
        <Tab.Navigator initialRouteName='Home' screenOptions={
              { headerShown: true, headerStyle: {
                backgroundColor: theme.colors.primary,
                shadowColor: 'transparent',
              }, headerTitle:'' }
            }>
            <Tab.Screen name="Home" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: () => ( <MaterialCommunitIcons name="food" color={theme.colors.primary} size={26} /> )
                        }} component={Home}
            />
            <Tab.Screen name="Search" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: () => ( <MaterialCommunitIcons name="clipboard-text-search-outline" color={theme.colors.primary} size={26} /> )
                        }} component={Search}
            />
            <Tab.Screen name="Plan" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: () => ( <MaterialCommunitIcons name="calendar-check" color={theme.colors.primary} size={26} /> )
                        }} component={Plan}
            />          
        </Tab.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: 'darkseagreen',
    secondary: 'yellow',
  }
};

export default App;
