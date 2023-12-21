import { FC, ReactElement } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { MasonryFlashList } from '@shopify/flash-list';
import { selectSearchSuggestions, suggestionsPayload } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';

export interface FullResultsProps{

}

const renderSuggestions = ({item}: { item: suggestionsPayload, index?:number }): ReactElement => {
    return(
        <Card style={styles.cardStyle}>
            <Card.Cover source={{ uri: item.node.mainImage }} />
            <Card.Title titleVariant='titleMedium' title={ item.node.name } subtitle={ item.node.totalTime } />
        </Card>
    );
}

const FullResults: FC<FullResultsProps> = () =>{
    const searchSuggestions = useAppSelector(selectSearchSuggestions);

    return (
        <View style={styles.flashListStyle}>
            <MasonryFlashList
                data={searchSuggestions}
                numColumns={3}
                keyExtractor={(item: suggestionsPayload) => item.node.id}
                estimatedItemSize={200}
                estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
                renderItem={renderSuggestions}
                getColumnFlex={(items, index, maxColumns, extraData) => {
                    return index === 1 ? 5 : 3;
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row'
    },
    cardStyle: {
        margin: 2
    }
});

export default FullResults;