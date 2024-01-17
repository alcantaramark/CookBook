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
import { NavigationContainer, ParamListBase, RouteProp, getFocusedRouteNameFromRoute } from '@react-navigation/native';
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
import RecipeSearch from './Features/Recipe/Components/RecipeSearch';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeDetails from './Features/Recipe/Components/RecipeDetails';
import { RootStackParamList } from './../types/App_Types';
import RecipeMain from './Features/Recipe/Components/RecipeMain';


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
  
  const shouldHideHeader = (route: RouteProp<ParamListBase, string>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    return routeName === 'Details';
  };

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
          options={{headerBackVisible: false, headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={ theme }>
        <Tab.Navigator initialRouteName='Home' 
              screenOptions={({ route }) => ({
                headerShown: !shouldHideHeader(route),
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                  shadowColor: 'transparent',
                  height: StatusBar.currentHeight
                  }, 
                  headerTitle:'' 
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

export default App;
