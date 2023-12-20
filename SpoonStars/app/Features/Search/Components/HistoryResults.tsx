import RFC, { FC, ReactElement } from 'react'
import { Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { selectSearchHistory, clearHistory } from '../SearchSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import { Dimensions, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface HistoryResultsProps {
    
}



const HistoryResults: FC<HistoryResultsProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);
    const dispatch = useAppDispatch();
    
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
    
    const listHeader = () => {
        return(
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Recent</Text>
                <Text style={styles.clearHistory} onPress={deleteHistory}>Clear</Text>
            </View>
        );
    }
    const deleteHistory = async () => {
        dispatch(clearHistory());
    };

    return (
        <FlashList
            ListHeaderComponent={listHeader}
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
        fontStyle: 'italic',
        marginTop: 10
    },
    historyIcon: {
        marginEnd: 30,
        top: 8
    },
    headerContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
        
    },
    clearHistory: {
        
    },
    headerTitle: {
        
    }
});

export default HistoryResults
