import React, { FC, createContext, useEffect, useRef, useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'
import { selectRecipeTags, selectRecipePreferencesStatus, updateRecipePreference, 
    saveRecipePreference, fetchRecipes, clearRecipes } from '../RecipeSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import RecipeMain from './RecipeMain';
import AutocompleteInput from 'react-native-autocomplete-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface RecipeHeaderProps {}

export const HomeContext = createContext(null as any);

const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const autocompleteField = useRef<any>(null);

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
      flexDirection: 'row'
    },
    searchInputField: {
      width: Dimensions.get('screen').width - 20,
      height: 40,
      marginStart: 10
    },
    searchInputFieldActive: {
      width: Dimensions.get('screen').width - 70,
      height: 40,
      marginStart: 5
    },
    searchIconBack: {
      color: 'black',
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
  }, [preferenceStatus])

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

  const options = [
    'Mark Alcantara', 'April Alcantara', 'Natalie Alcantara'
  ]

  const handleSearchTextChanged = (text: string) => {
    setSearchText(text);
    if (text === ''){
      setSuggestions([]);
      return;
    }

    const possibleValues = options.filter((option: string) => option.startsWith(text));
    console.log(possibleValues);
    setSuggestions(possibleValues);
  }
  
  useEffect(() => {
    if (!isSearching) {
      autocompleteField.current.blur();
    }
  }, [isSearching])

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.searchInput}>
          {isSearching &&
            <MaterialCommunityIcons 
                              name='arrow-left-circle-outline' style={styles.searchIconBack} 
                              onPress={() => setIsSearching(!isSearching)}
            />
          }
          <AutocompleteInput
            data={suggestions}
            flatListProps={{
            }}
            renderTextInput={() => 
              <TextInput
                theme={{ roundness: 10 }}
                placeholder='search recipes...'
                value={searchText}
                style={ isSearching ? styles.searchInputFieldActive : styles.searchInputField }
                onChangeText={(text: string) => handleSearchTextChanged(text)}
                onFocus={() => setIsSearching(!isSearching)}
                mode='outlined'
                ref={autocompleteField}
                left={ !isSearching &&
                    <TextInput.Icon icon={() => <MaterialCommunityIcons name='magnify' style={styles.searchIconMagnify} /> } />
                }
              />
            }
          />
        </View>
        <GestureHandlerRootView>
          <ScrollView horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            style={styles.scroll}
          >
          { createButtons() }
             </ScrollView>
        </GestureHandlerRootView> 
      </View> 
      <RecipeMain />
    </View>
)};


export default RecipeHeader;
