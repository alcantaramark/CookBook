import React, { FC, useEffect } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { selectSearchHistory, selectSearchSuggestions, suggestionsPayload } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';


interface SearchResultProps {}

const SearchResults: FC<SearchResultProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);
    const searchSuggestions = useAppSelector(selectSearchSuggestions);

    useEffect(() => {
        console.log('search History', searchHistory);
    }, [searchSuggestions, searchHistory])

    const showHistory = () => {
        return(
            <FlashList
                data={searchHistory}
                keyExtractor={(item: string):string => item}
                renderItem={({item, index}) => { return (<Text>{item}</Text>)}}
                estimatedItemSize={200}
                estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
            />
            
        )
    }

    return(
    <View style={styles.flashListStyle}>
    <FlashList
        ListEmptyComponent={showHistory}
        data={searchSuggestions}
        keyExtractor={(item: suggestionsPayload):string => item.node.name}
        renderItem={(item) => {  return (<Text>{item.item.node.name}</Text>) }}
        estimatedItemSize={200}
        estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
        />
    </View>);
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row'
    }
});
  
export default SearchResults;
