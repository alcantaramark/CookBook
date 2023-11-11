import React, { FC, Fragment, createContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Searchbar, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import HomeMain from './Main';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import ListItem from 'react-native-paper/lib/typescript/components/List/ListItem';

interface HomeProps {}

export const HomeContext = createContext(null as any);


const Home: FC<HomeProps> = () => { 
  const [searchText, setSearchText] = useState('');

  return (
    <HomeContext.Provider value={{searchText}}>
      <View style={styles.container}>
        <Searchbar placeholder='search recipe...' 
          onChangeText={(text) => setSearchText(text)} value={searchText}
          style={styles.searchInput} mode='bar'  />
        <GestureHandlerRootView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Button style={styles.recipeTag}  mode="contained-tonal">Breakfast</Button>
              <Button style={styles.recipeTag}  mode="contained-tonal">Dessert</Button>
              <Button style={styles.recipeTag}  mode="contained-tonal">Vegan</Button>
              <Button style={styles.recipeTag}  mode="contained-tonal">Appetizer</Button>
              <Button style={styles.recipeTag}  mode="contained-tonal">Quickfix</Button>
              <Button style={styles.recipeTag}  mode="contained-tonal">Festive</Button>
            </ScrollView>
        </GestureHandlerRootView>  
        <HomeMain />        
      </View>
    </HomeContext.Provider>
)};

const styles = StyleSheet.create({
  recipeTag: {
    margin: 2,
    height: 37,
    fontFamily: 'arial'
  },
  container: {
    marginHorizontal: 5
  },
  header: {
    backgroundColor: 'transparent'
  },
  searchInput: {
    width: '100%',
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginVertical: 10,
    height: 50
  }
})


export default Home;
