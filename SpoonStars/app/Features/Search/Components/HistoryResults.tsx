import { FC, ReactElement } from 'react'
import { Text } from 'react-native-paper';
import { selectSearchHistory, clearHistory, selectSearchText, selectSearchHistoryStatus, setShowFullResults, clearPaging, setShowListResults } from '../Scripts/SearchSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import { Dimensions, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppTheme } from './../../../App';
import SearchHelper from '../Scripts/useSearch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { ActionSheetIOS } from 'react-native';

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
        dispatch(clearPaging());
        dispatch(setShowListResults(true));
        //search(true, query);
    };
    
    const listHeader = () => {
        return(
            <View style={styles.headerContainer}>
                <Text>Recent</Text>
                <Text style={{color: primary}} onPress={showConfirmActionSheet}>Clear</Text>
            </View>
        );
    }
    
    const noResultsFounds = () =>{
        return(<View style={styles.noResults}>
                <Text>No results found for "{searchText}"</Text>
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
    
    return (
        <View style={styles.flashList}>
        { (searchHistoryStatus === 'succeeded' && searchHistory.length > 0) &&
            <FlashList
                ListHeaderComponent={listHeader}
                data={searchHistory}
                keyExtractor={(item: string):string => item}
                renderItem={renderResultItem}
                ListFooterComponent={noResultsFounds}
                estimatedItemSize={10}
                estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
                numColumns={1}
            />
        }
        </View>
    );
}

const styles = StyleSheet.create({
    flashList: {
        flexGrow: 1,
        flexDirection: 'row',
        height: 200,
        width: Dimensions.get('screen').width
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
    clearHistory: {
        
    },
    noResults: {
        flexDirection: 'row',
        marginTop: 20,
        alignSelf: 'center'
    }
});

export default HistoryResults
