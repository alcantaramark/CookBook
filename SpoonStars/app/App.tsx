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
import { NavigationContainer, ParamListBase, RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PropsWithChildren} from 'react';
import {
  StatusBar,
  Text,
  useColorScheme,
  StyleSheet
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { useAppDispatch } from './Redux/Hooks';
import { fetchConfig } from './Features/Configuration/ConfigSlice';
import { loadRecipePreference } from './Features/Recipe/Scripts/RecipeSlice';
import RecipeSearch from './Features/Recipe/Components/RecipeSearch';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeDetails from './Features/Recipe/Components/RecipeDetails';
import { RootStackParamList } from './../types/App_Types';
import RecipeMain from './Features/Recipe/Components/RecipeMain';
import { selectSearchSuggestions } from './Features/Search/Scripts/SearchSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';


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


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator<RootStackParamList>();
  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const dispatch = useAppDispatch();
  
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
        opacity: interpolate(0, [0, 250 / 1.5], [0, 1])
    }
});

  dispatch(fetchConfig());
  dispatch(loadRecipePreference());

  
  
  const RecipeTab = () => {
    return(
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={RecipeMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name='Search'
          component={RecipeSearch}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name='Details'
          component={RecipeDetails}
          initialParams={{ id: '' }}
          options={{
            headerTitle:'', 
            headerBackVisible: false,
            headerTransparent: true, contentStyle: { flex: 1 }
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={ theme }>
        <Tab.Navigator initialRouteName='Home' 
              screenOptions={({ route }) => ({
                headerShown: false,
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                  shadowColor: 'transparent',
                  height: StatusBar.currentHeight,
                  },
              })}
            >
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderWidth: StyleSheet.hairlineWidth
}
});

export default App;
