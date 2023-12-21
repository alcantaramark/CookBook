import React, { FC, ReactElement, useEffect } from 'react'
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { selectSearchSuggestions, suggestionsPayload } from '../SearchSlice';
import { useAppSelector } from '../../../Redux/Hooks';
import HistoryResults from './HistoryResults';
import { useAppTheme } from '../../../App';


interface PreviewResultsProps {}


const PreviewResults: FC<PreviewResultsProps> = () => {
    const searchSuggestions = useAppSelector(selectSearchSuggestions);
    const { colors: { primary }} = useAppTheme();    
    

    const renderItem = ({item}: { item: suggestionsPayload, index?:number }): ReactElement => {
        return (<Text>{item.node.name}</Text>)
    }

    const footerComponent = () => {
        return(
            <View style={styles.footer}>
                <Text style={{color: primary}}>See all Results</Text>
            </View>
        );
    }

    return(
    <View style={styles.flashListStyle}>
        <FlashList
            ListEmptyComponent={<HistoryResults />}
            data={searchSuggestions}
            keyExtractor={(item: suggestionsPayload):string => item.node.id}
            renderItem={renderItem}
            estimatedItemSize={200}
            ListFooterComponent={searchSuggestions === null ? null : footerComponent}
        />
    </View>);
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row',
      marginStart: 10,
      marginEnd: 10
    },
    footer: {
        alignItems: 'center',
        
    }
});
  
export default PreviewResults;
