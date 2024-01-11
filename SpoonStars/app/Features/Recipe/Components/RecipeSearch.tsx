import React, { FC } from 'react';
import { SegmentedButtons } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../App'
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';

import { setSearchBy, selectSearchBy, selectShowListResults } from '../../Search/Scripts/SearchSlice';
import PreviewResults from '../../Search/Components/PreviewResults';
import FullResults from '../../Search/Components/FullResults';
import SearchHelper from '../../Search/Scripts/useSearch';
import SearchBar from '../../Search/Components/SearchBar';
import { SearchScreenProps } from '../../../../types/App_Types';



const RecipeSearch: FC<SearchScreenProps> = ({route, navigation} : SearchScreenProps) => { 

  const { colors: { primary } } = useAppTheme();
  const searchBy = useAppSelector(selectSearchBy);
  const showListResults = useAppSelector(selectShowListResults);
  
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
      { showListResults ? <PreviewResults /> : <FullResults />}

    </View>
)};


export default RecipeSearch;
