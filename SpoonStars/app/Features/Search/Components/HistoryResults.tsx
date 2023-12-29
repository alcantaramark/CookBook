import RFC, { FC, ReactElement, useState } from 'react'
import { Text } from 'react-native-paper';
import { selectSearchHistory, clearHistory, selectSearchStatus, selectSearchHistoryStatus, setShowFullResults, clearPaging } from '../SearchSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from './../../../App';
import { FlatList } from 'react-native';
import useSearch from '../Hooks/useSearch';
import { GestureDetector, GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

interface HistoryResultsProps {
    
}



const HistoryResults: FC<HistoryResultsProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);
    const searchHistoryStatus = useAppSelector(selectSearchHistoryStatus);
    const { search } = useSearch();
    const dispatch = useAppDispatch();
    const { colors: { primary }} = useAppTheme();    
    
    const renderResultItem = ({item}: { item: string, index?:number }): ReactElement => {
        return(
            <View>
                <TouchableOpacity onPress={() => handleHistorySearch(item)} style={styles.resultContainer}>
                    <MaterialCommunityIcons
                        name='history'
                        size={20}
                        style={styles.historyIcon}
                    />
                    <Text style={styles.historyText}>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleHistorySearch = (query: string) => {
        dispatch(clearPaging());
        dispatch(setShowFullResults(true));
        search(true, query);
    };
    
    const listHeader = () => {
        return(
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Recent</Text>
                <Text style={{color: primary}} onPress={() => dispatch(clearHistory())}>Clear</Text>
            </View>
        );
    }
    
    return (
        <GestureHandlerRootView>
        { (searchHistoryStatus === 'succeeded') &&
            <FlatList
                ListHeaderComponent={searchHistory.length > 0 ? listHeader : null}
                data={searchHistory}
                keyExtractor={(item: string):string => item}
                renderItem={renderResultItem}
            />
        }
        </GestureHandlerRootView>
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
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
        
    },
    clearHistory: {
        
    },
    headerTitle: {
        
    }
});

export default HistoryResults
