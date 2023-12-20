import RFC, { FC, ReactElement } from 'react'
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { selectSearchHistory } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import { Dimensions, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface HistoryResultsProps {
    
}

const renderResultItem = ({item}: { item: string, index?:number }): ReactElement => {
    return(
        <View style={styles.resultContainer}>
            <MaterialCommunityIcons
                name='history'
                size={20}
                style={styles.historyIcon}
            />
            <Text style={styles.historyText}>{item}</Text>
        </View>
    )
}

const HistoryResults: FC<HistoryResultsProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);

    return (
        <FlashList
            data={searchHistory}
            keyExtractor={(item: string):string => item}
            renderItem={renderResultItem}
            estimatedItemSize={200}
            estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
        />
    );
}

const styles = StyleSheet.create({
    resultContainer: {
        flexDirection: 'row',
    },
    historyText:{
        fontStyle: 'italic'
    },
    historyIcon: {
        marginEnd: 30,
    }
});

export default HistoryResults
