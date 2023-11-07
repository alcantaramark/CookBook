/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {  Button, 
          PaperProvider, 
          MD3LightTheme as defaultTheme } 
      from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunitIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PropsWithChildren} from 'react';

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
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { runCLI } from 'jest';
import Home from './app/components/Home/Home';
import Search from './app/components/Search/Search';
import Plan from './app/components/Plan/Plan';

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
        <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: ({ color }) => ( <MaterialCommunitIcons name="food" color={color} size={26} /> )
                        }} component={Home}
            />
            <Tab.Screen name="Search" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: ({ color }) => ( <MaterialCommunitIcons name="clipboard-text-search-outline" color={color} size={26} /> )
                        }} component={Search}
            />
            <Tab.Screen name="Plan" 
              options={{  tabBarShowLabel: true,
                          tabBarIcon: ({ color }) => ( <MaterialCommunitIcons name="calendar-check" color={color} size={26} /> )
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
    primary: 'tomato',
    secondary: 'yellow'
  }
};

export default App;
