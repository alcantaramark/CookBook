import React, { FC, ReactElement, useEffect } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { selectSearchHistory, selectSearchSuggestions, suggestionsPayload } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import HistoryResults from './HistoryResults';


interface SearchResultProps {}

const SearchResults: FC<SearchResultProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);
    const searchSuggestions = useAppSelector(selectSearchSuggestions);


    const renderItem = ({item}: { item: suggestionsPayload, index?:number }): ReactElement => {
        return (<Text>{item.node.name}</Text>)
    }

    return(
    <View style={styles.flashListStyle}>
        <FlashList
            ListEmptyComponent={<HistoryResults />}
            data={searchSuggestions}
            keyExtractor={(item: suggestionsPayload):string => item.node.id}
            renderItem={renderItem}
            estimatedItemSize={200}
        />
    </View>);
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row',
      marginStart: 10
    }
});
  
export default SearchResults;
