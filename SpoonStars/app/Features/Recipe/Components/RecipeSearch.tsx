import React, { FC } from 'react';
import { SegmentedButtons } from 'react-native-paper';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../App'
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { setSearchBy, selectSearchBy, selectShowListResults } from '../../Search/Scripts/SearchSlice';
import PreviewResults from '../../Search/Components/PreviewResults';
import FullResults from '../../Search/Components/FullResults';
import SearchBar from '../../Search/Components/SearchBar';
import { SearchScreenProps } from '../../../../types/App_Types';
import { SafeAreaView } from 'react-native-safe-area-context';


const RecipeSearch: FC<SearchScreenProps> = ({route, navigation} : SearchScreenProps) => { 

  const { colors: { primary } } = useAppTheme();
  const searchBy = useAppSelector(selectSearchBy);
  const showListResults = useAppSelector(selectShowListResults);
  
  const dispatch = useAppDispatch();

  
  const handleSearchByChange = (val: string) => {
    dispatch(setSearchBy(val));
  }

  return (
    <>
      <SafeAreaView style={[{ backgroundColor: primary }]}/>
      <View style={[styles.container, { backgroundColor: primary }]}>
        <SearchBar />
        <SegmentedButtons 
          value={searchBy}
          style={styles.searchBy}
          buttons={[
            { value: 'name', label: 'Name', checkedColor: primary },
            { value: 'ingredients', label: 'Ingredients', checkedColor: primary }
          ]}
          onValueChange={(val) => handleSearchByChange(val)}
          density='high'
          theme={useAppTheme}
        />
      </View> 
      <View style={styles.resultsView}>
      { showListResults ? <PreviewResults /> : <FullResults />}
      </View>
    </>
)};

const styles = StyleSheet.create({
  resultsView: {
    marginTop: -28
  },
  loading: {
    alignContent: "center"
  },
  container: {
    top: StatusBar.currentHeight! - 35,
    bottom: -40
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

export default RecipeSearch;
