import React, { FC, createContext, useEffect, useRef, useState } from 'react';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { selectRecipeTags, selectRecipePreferencesStatus, updateRecipePreference, 
    saveRecipePreference, fetchRecipes, clearRecipes } from '../RecipeSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import RecipeMain from './RecipeMain';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { selectShowFullResults, saveSearchHistory, 
    fetchSearchHistory, setSearchBy, selectSearchSuggestions, setShowFullResults, clearPaging,
    selectSearchBy, selectSearchText, setSearchText } 
    from './../../Search/SearchSlice';
import PreviewResults from './../../Search/Components/PreviewResults';
import FullResults from './../../Search/Components/FullResults';
import useSearch from './../../Search/Hooks/useSearch';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipeDetails } from './RecipeDetails';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';




interface RecipeHeaderProps {}



const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const [isSearching, setIsSearching] = useState(false);
  
  const autocompleteField = useRef<any>(null);

  const { colors: { primary } } = useAppTheme();
  const recipeTags = useAppSelector(selectRecipeTags);
  const preferenceStatus = useAppSelector(selectRecipePreferencesStatus);
  const searchSuggestions = useAppSelector(selectSearchSuggestions);
  const showFullResults = useAppSelector(selectShowFullResults);
  const searchBy = useAppSelector(selectSearchBy);
  const searchText = useAppSelector(selectSearchText);
  const { search } = useSearch();
  
  const dispatch = useAppDispatch();
  const [tagStyles, setTagStyles] = useState<string[]>([]);

  const fetchHistory = async (text: string) => { 
    if (text === undefined){
      text = '';
    }
    await dispatch(fetchSearchHistory(text));
  }

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
      flexDirection: 'row',
    },
    searchInputField: {
      width: Dimensions.get('screen').width - 20,
      height: 40,
      marginStart: 10,
    },
    searchInputFieldActive: {
      width: Dimensions.get('screen').width - 52,
      height: 40,
      marginStart: 5,
    },
    searchIconBack: {
      color: 'gray',
      fontSize: 30,
      top: 8,
      marginStart: 10
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
    search(showFullResults, searchText);
  }, [searchBy])
  
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

  const handleSearchTextChanged =  async (text: string) => {
    setIsSearching(true);
    if (searchText === text || text === ''){
      dispatch(setShowFullResults(true));
      dispatch(clearPaging());
      search(true, text);
    }
    else {
      dispatch(setShowFullResults(false));
      search(false, text);
    }
  }

  const handleEnterPress = async () => {
    dispatch(setShowFullResults(true));
    await dispatch(saveSearchHistory(searchText));
  }

  const handleSearchIconPress = () => {
    setIsSearching(false);
    dispatch(setSearchText(''));
  }

  const handleSearchOnFocus = async () => {
    if (searchText == ''){
      setIsSearching(true) ;
      dispatch(setShowFullResults(true));
      search(true, searchText);
    }
  }

  const mainView = () => {
    
    if (isSearching){
      return showFullResults ? <FullResults /> : <PreviewResults />
    }else{
      return <RecipeMain />
    }
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.searchInput}>
          {isSearching &&
            <MaterialCommunityIcons 
              name='arrow-left-thin' style={styles.searchIconBack} 
              onPress={handleSearchIconPress}
            />
          }
          <TextInput
            theme={{ roundness: 10 }}
            placeholder='search recipes...'
            value={searchText}
            style={ isSearching ? styles.searchInputFieldActive : styles.searchInputField }
            onChangeText={(text: string) => handleSearchTextChanged(text)}
            mode='outlined'
            ref={autocompleteField}
            left={ !isSearching &&
                <TextInput.Icon 
                  icon={() => <MaterialCommunityIcons name='magnify' style={styles.searchIconMagnify} /> }  
                />
            }
            onFocus={handleSearchOnFocus}
            onSubmitEditing={handleEnterPress}
          />
        </View>
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
