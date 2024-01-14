import { FC, ReactElement, useEffect } from 'react'
import { Text } from 'react-native-paper';
import { selectSearchHistory, clearHistory, selectSearchText, selectSearchHistoryStatus, clearPaging, setShowListResults, fetchSearchHistory, setRecordPerPage, setSearchText, setShowFullResults } from '../Scripts/SearchSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import { Dimensions, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from './../../../App';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { ActionSheetIOS } from 'react-native';
import { searchApi } from '../../Api/SearchApi';

interface HistoryResultsProps {
    
}



const HistoryResults: FC<HistoryResultsProps> = () => {
    const searchHistory = useAppSelector(selectSearchHistory);
    const searchHistoryStatus = useAppSelector(selectSearchHistoryStatus);
    const searchText = useAppSelector(selectSearchText);
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
        dispatch(searchApi.util.resetApiState());
        dispatch(setRecordPerPage(10));
        dispatch(setShowListResults(true));
        dispatch(setShowFullResults(true));
        dispatch(setSearchText(query));
    };
    
    const noResultsFounds = () =>{
        return(<View style={styles.noResults}>
                <Text>No results found for "{searchText}"</Text>
            </View>
        );
    }

    const listHeader = () => {
        return(
            <View style={styles.headerContainer}>
                <Text>Recent</Text>
                <Text style={{color: primary}} onPress={showConfirmActionSheet}>Clear</Text>
            </View>
        );
    }
    
    const showConfirmActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', 'Delete History'],
            cancelButtonIndex: 0
        }, async buttonIndex => {
            if (buttonIndex == 1){
                await dispatch(clearHistory())
            }
        });
    }
    
    const fetchHistory = () => {
        dispatch(fetchSearchHistory(searchText));
    }

    useEffect(() => {
        fetchHistory();
    }, [searchText])

    return (
        <GestureHandlerRootView style={styles.flashList}>
        { (searchHistoryStatus === 'succeeded' && searchHistory.length > 0) &&
            <FlashList
                ListHeaderComponent={listHeader}
                data={searchHistory}
                keyExtractor={(item: string):string => item}
                renderItem={renderResultItem}
                estimatedItemSize={10}
                estimatedListSize={{ height: 100, width: Dimensions.get('screen').width }}
                numColumns={1}
            />
        }
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flashList: {
        flexGrow: 1,
        flexDirection: 'row',
        height: 100,
        width: Dimensions.get('screen').width,
        margin: 15
    },
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
        marginEnd: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
        
    },
    noResults: {
        flexDirection: 'row',
        marginTop: 20,
        alignSelf: 'center'
    }
});

export default HistoryResults
