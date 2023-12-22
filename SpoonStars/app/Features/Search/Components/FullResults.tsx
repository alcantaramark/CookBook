import { FC, ReactElement, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { selectSearchSuggestions, suggestionsPayload } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import MasonryList from '@react-native-seoul/masonry-list';

export interface FullResultsProps{

}

const renderSuggestions = ({item}: { item: suggestionsPayload, index?:number }): ReactElement => {
    return(
        <Card style={styles.cardStyle}>
            <Card.Cover source={{ uri: item.node.mainImage }} style={styles.cardImage} />
        </Card>
    );
}

const renderItem = (({item}:any) => {
    const randomBool = Math.random() < 0.5;

    return(
        <Card style={styles.cardStyle}>
            <Card.Cover source={{ uri: item.node.mainImage }} style={{
                height: randomBool ? 150 : 280,
                alignSelf: 'stretch',
                borderRadius: 0
            }} />
        </Card>
    );
})

const FullResults: FC<FullResultsProps> = () =>{
    const searchSuggestions = useAppSelector(selectSearchSuggestions);

    return (
        <View style={styles.flashListStyle}>
            <MasonryList
                data={searchSuggestions}
                numColumns={3}
                keyExtractor={(item: suggestionsPayload) => item.node.id}
                renderItem={renderItem}
                style={{alignSelf: 'stretch'}}
                contentContainerStyle={{
                    alignSelf: 'stretch'
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
        margin: 2,
        borderRadius: 0
    },
    cardImage: {
        borderRadius: 0
    }
});

export default FullResults;