import React, { FC, Fragment, createContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Searchbar, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { useAppDispatch, useAppSelector } from '../../../Redux/Hooks';
import { fetchConfig } from '../../GetConfigurations/ConfigSlice';



interface HomeProps {}

export const HomeContext = createContext(null as any);

const Home: FC<HomeProps> = () => { 
  const [searchText, setSearchText] = useState('');
  const { colors: { primary } } = useAppTheme();

  const styles = StyleSheet.create({
    recipeTag: {

    },
    container: {
      backgroundColor: primary
    },
    header: {
      backgroundColor: 'transparent'
    },
    searchInput: {
      backgroundColor: 'white',
      marginHorizontal: 10,
      marginVertical: 10,
      height: 50
    }
  })

   const config = useAppSelector(state => state.config.value);
   const dispatch = useAppDispatch();

   useEffect(() => { dispatch(fetchConfig()); console.log('I am here') }, []);

  return (
    <View>
      <View style={styles.container} >
        <Searchbar placeholder='search recipe...' 
          onChangeText={(text) => setSearchText(text)} value={searchText}
          style={styles.searchInput} mode='bar'  />
        <GestureHandlerRootView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Button style={styles.recipeTag}  mode="contained">Breakfast</Button>
              <Button style={styles.recipeTag}  mode="contained">Dessert</Button>
              <Button style={styles.recipeTag}  mode="contained">Vegan</Button>
              <Button style={styles.recipeTag}  mode="contained">Appetizer</Button>
              <Button style={styles.recipeTag}  mode="contained">Quickfix</Button>
              <Button style={styles.recipeTag}  mode="contained">Festive</Button>
            </ScrollView>
        </GestureHandlerRootView> 
      </View> 
      <Text>{ config.SuggesticUserId }</Text>
      <Text>{ config.SuggesticAPIKey }</Text> 
    </View>
)};

export default Home;
