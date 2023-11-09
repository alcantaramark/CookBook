import React, { FC, Fragment, createContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import HomeMain from './Main';

interface HomeProps {}

export const HomeContext = createContext(null as any);


const Home: FC<HomeProps> = () => { 
  const [searchText, setSearchText] = useState('');

  return (
    <HomeContext.Provider value={{searchText}}>
      <SafeAreaView>
        <View>
          <TextInput placeholder='search recipe...' onChangeText={(text) => setSearchText(text)} />
          <HomeMain />        
        </View>
      </SafeAreaView>
    </HomeContext.Provider>
)};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  textInput: {
    width: '100%',
    flex: 1
  }
})


export default Home;
