import React, { FC, createContext, createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { Searchbar, Button, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { selectRecipeTags, selectRecipePreferencesStatus, setRecipePreference, recipeTag, updateRecipePreference } from '../RecipeSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeMain from './RecipeMain';


interface RecipeHeaderProps {}

export const HomeContext = createContext(null as any);

const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const [searchText, setSearchText] = useState('');
  const { colors: { primary } } = useAppTheme();
  const recipeTags = useAppSelector(selectRecipeTags);
  const preferenceStatus = useAppSelector(selectRecipePreferencesStatus);
  
  const dispatch = useAppDispatch();
  const [tagStyles, setTagStyles] = useState<string[]>([]);
  
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
    const nextStyles = tagStyles.map((item, i) => {
      if (index == i) {
        item = 'white';
        recipeTags[index].preferred = true;
      }
      else {
        item = 'black';
        recipeTags[index].preferred = false;
      }
      return item;
    });

    setTagStyles(nextStyles);
    dispatch(updateRecipePreference(index));
  };

  useEffect(() => {
    if (preferenceStatus === 'succeeded') {
      const modes = recipeTags.map(item => item.preferred ? 'white' : 'black'); 
      setTagStyles(modes);
    }
  }, [preferenceStatus])

  useEffect(() => {
    if (recipeTags.length > 0){
      dispatch(setRecipePreference(recipeTags));
    }
  }, [recipeTags]);

  const createButtons = () => {
    return ( 
      recipeTags.map((item, index) => {
        return (
          <Button 
            compact={true} 
            textColor={tagStyles[index]}
            mode='text'
            onPress={() => handleChipPress(index)} 
            key={index}>{item.name}
          </Button>
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
              {createButtons() }
              <Button
                compact={true} 
                textColor='black' 
                icon={() => (<MaterialCommunityIcons name="star" size={20} />)}>customize
              </Button>
            </ScrollView>
        </GestureHandlerRootView> 
      </View> 
      <RecipeMain />
    </>
)};


export default RecipeHeader;
