import React, { FC, createContext, createRef, forwardRef, useRef, useState } from 'react';
import { Searchbar, Chip, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { recipeTag, selectRecipeTags } from '../RecipeSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface RecipeHeaderProps {}

export const HomeContext = createContext(null as any);

const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const [searchText, setSearchText] = useState('');
  const { colors: { primary } } = useAppTheme();
  const recipeTags = useAppSelector(selectRecipeTags);
  const chipRefs= useRef(new Array());

  recipeTags.map(item => chipRefs.current.push(item));


  const styles = StyleSheet.create({
    loading: {
      alignContent: "center"
    },
    recipeTag: {
      backgroundColor: primary,
    },
    container: {
      backgroundColor: primary,
    },
    header: {
      backgroundColor: 'transparent'
    },
    searchInput: {
      backgroundColor: 'white',
      marginHorizontal: 10,
      marginVertical: 10,
      height: 50
    },
    scroll: {
      marginTop: 5,
      marginBottom: 10,
    }
  })

  const handleChipPress = (index: number) => {
    console.log('chipref', chipRefs.current[index]);
  };

  const createChips = () => {
    return (
      recipeTags.map((item, index) => {
        return (
          <Button ref={(ref) => chipRefs.current.push(ref)} 
            compact={true} textColor='black' onPress={() => handleChipPress(index)} key={index}>{item.name}</Button>
        )
      })
    )
  }

  return (
    <>
      <View style={styles.container} >
        <Searchbar placeholder='search recipe...' 
          onChangeText={(text) => setSearchText(text)} value={searchText}
          style={styles.searchInput} mode='bar'  />
        <GestureHandlerRootView>
            <ScrollView horizontal={true} 
              showsHorizontalScrollIndicator={false} 
              style={styles.scroll}
            >
              { createChips() }
              <Button ref={(ref) => chipRefs.current.push(ref)} 
              compact={true} textColor='black' icon={() => (<MaterialCommunityIcons name="star" size={20} />)}>customize</Button>
            </ScrollView>
        </GestureHandlerRootView> 
      </View> 
    </>
)};


export default RecipeHeader;
