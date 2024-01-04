import React, { FC, useEffect, useState } from 'react';
import { Button, SegmentedButtons } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { selectRecipeTags, selectRecipePreferencesStatus, updateRecipePreference, 
    saveRecipePreference, fetchRecipes, clearRecipes } from '../Scripts/RecipeSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import RecipeMain from './RecipeMain';
import { selectShowFullResults, selectIsSearching,
    fetchSearchHistory, setSearchBy, selectSearchSuggestions, clearPaging,
    selectSearchBy, selectSearchText, setShowListResults } 
    from '../../Search/Scripts/SearchSlice';
import PreviewResults from './../../Search/Components/PreviewResults';
import FullResults from './../../Search/Components/FullResults';
import SearchHelper from '../../Search/Scripts/Search';
import SearchBar from './../../Search/Components/SearchBar';




interface RecipeHeaderProps {}



const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const { colors: { primary } } = useAppTheme();
  const recipeTags = useAppSelector(selectRecipeTags);
  const preferenceStatus = useAppSelector(selectRecipePreferencesStatus);
  const searchSuggestions = useAppSelector(selectSearchSuggestions);
  const showFullResults = useAppSelector(selectShowFullResults);
  const searchBy = useAppSelector(selectSearchBy);
  const searchText = useAppSelector(selectSearchText);
  const isSearching = useAppSelector(selectIsSearching);
  
  const { search } = SearchHelper();
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
    searchIconMagnify: {
      color: 'gray',
      fontSize: 25,
    },
    scroll: {
      marginTop: 5,
      marginBottom: 10,
    },
    searchBy: {
      height: 28,
      margin: 10,
      borderRadius: 10,
      
    }
  })

  
  const handlePreferencePress = (index: number) => {
    const nextStyles = tagStyles.map((item, i) => {
      if (index == i) {
        item = item === 'white' ? 'black' : 'white';
      }
      else {
        item = 'black';
      }
      return item;
    });

    dispatch(clearRecipes());
    setTagStyles(nextStyles);
    dispatch(updateRecipePreference(index));
    dispatch(saveRecipePreference());
    dispatch(fetchRecipes());
  };

  useEffect(() => {
    if (preferenceStatus === 'succeeded') {
      const modes = recipeTags.map(item => item.preferred == true ? 'white' : 'black'); 
      setTagStyles(modes);
    }
  }, [preferenceStatus]);

  useEffect(() => { 
    if (searchSuggestions.length == 0){
      fetchHistory(searchText);
    }

  }, [searchSuggestions]);

  useEffect(() => {
    dispatch(clearPaging());
    dispatch(setShowListResults(false));
    search(showFullResults, searchText);
  }, [searchBy, isSearching])
  
  const fetchHistory = async (text: string) => { 
    if (text === undefined){
      text = '';
    }
    await dispatch(fetchSearchHistory(text));
  }

  

  const mainView = () => {
    if (isSearching){
      return showFullResults ? <FullResults /> : <PreviewResults />
    }else{
      return <RecipeMain />
    }
  }

  const createButtons = () => {
    return ( 
      recipeTags.map((item, index) => {
        return (
          <Button 
            compact={true} 
            textColor={tagStyles[index]}
            mode='text'
            onPress={() => handlePreferencePress(index)} 
            key={index}>{item.name}
          </Button>
        )
      })
    )
  }

  return (
    <View>
      <View style={styles.container}>
          <SearchBar />
        {isSearching &&
          <SegmentedButtons 
            value={searchBy}
            style={styles.searchBy}
            buttons={[
              { value: 'name', label: 'Name', checkedColor: primary },
              { value: 'ingredients', label: 'Ingredients', checkedColor: primary }
            ]}
            onValueChange={(val) => dispatch(setSearchBy(val))}
            density='high'
            theme={useAppTheme}
          />
        }
        {!isSearching && 
          <GestureHandlerRootView>
            <ScrollView horizontal={true} 
              showsHorizontalScrollIndicator={false} 
              style={styles.scroll}
            >
          { createButtons() }
             </ScrollView>
          </GestureHandlerRootView> 
        }  
        </View> 
        { mainView() }
    </View>
)};


export default RecipeHeader;
