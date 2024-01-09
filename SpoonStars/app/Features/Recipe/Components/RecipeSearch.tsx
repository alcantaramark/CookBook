import React, { FC, useEffect, useState } from 'react';
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../App'
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';

import { selectShowFullResults, selectIsSearching,
    fetchSearchHistory, setSearchBy, selectSearchSuggestions, clearPaging,
    selectSearchBy, selectSearchText, setShowListResults, 
    selectShowListResults} 
    from '../../Search/Scripts/SearchSlice';
import PreviewResults from '../../Search/Components/PreviewResults';
import FullResults from '../../Search/Components/FullResults';
import SearchHelper from '../../Search/Scripts/Search';
import SearchBar from '../../Search/Components/SearchBar';
import { SearchScreenProps } from '../../../../types/App_Types';


const RecipeSearch: FC<SearchScreenProps> = ({route, navigation} : SearchScreenProps) => { 

  const { colors: { primary } } = useAppTheme();
  const searchSuggestions = useAppSelector(selectSearchSuggestions);
  const showFullResults = useAppSelector(selectShowFullResults);
  const searchBy = useAppSelector(selectSearchBy);
  const searchText = useAppSelector(selectSearchText);
  const isSearching = useAppSelector(selectIsSearching);
  const showListResults = useAppSelector(selectShowListResults);
  
  const { search } = SearchHelper();
  const dispatch = useAppDispatch();

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

  // useEffect(() => { 
  //   if (searchSuggestions.length == 0){
  //     fetchHistory(searchText);
  //   }

  // }, [searchSuggestions]);

  // useEffect(() => {
  //   dispatch(clearPaging());
  //   dispatch(setShowListResults(false));
  //   search(showFullResults, searchText);
  // }, [searchBy, isSearching])
  
  const fetchHistory = async (text: string) => { 
    if (text === undefined){
      text = '';
    }
    await dispatch(fetchSearchHistory(text));
  }
  return (
    <View>
      <View style={styles.container}>
          <SearchBar />
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
      </View> 
      { showListResults ? <PreviewResults /> : <FullResults /> }
    </View>
)};


export default RecipeSearch;
