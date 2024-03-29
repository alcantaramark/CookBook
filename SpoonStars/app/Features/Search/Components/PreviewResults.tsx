import React, { FC, ReactElement, useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { suggestionsPayload, selectShowFullResults, setShowFullResults, selectSearchText, setSearchPageInfo, setRecordPerPage } from '../Scripts/SearchSlice';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import HistoryResults from './HistoryResults';
import { StackNavigation, Suggestions } from '../../../../types/App_Types';
import { useAppTheme } from '../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import useLoading from '../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { UIActivityIndicator } from 'react-native-indicators';
import { FlashList } from '@shopify/flash-list';
import useSearch from '../Scripts/useSearch';



interface PreviewResultsProps {}


const PreviewResults: FC<PreviewResultsProps> = () => {
    const showFullResults = useAppSelector(selectShowFullResults);
    const searchText = useAppSelector(selectSearchText);
    const { SearchLoader } = useLoading();
    const { showError } = useErrorHandler();

    const { navigate } = useNavigation<StackNavigation>();
    const dispatch = useAppDispatch();

    //RTK
    const { data, isLoading, error, isFetching } = useSearch();
    const { colors: { primary }} = useAppTheme();    


    const renderItem = ({item}: { item: Suggestions, index?:number }): ReactElement => {
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={() => navigate('Details', { id: item.node.id })}>
                <View style={styles.searchDetails}>
                    <Avatar.Image source={{ uri: item.node.mainImage }} size={50} style={styles.avatar}/>
                    <Text style={styles.searchText} numberOfLines={1}>{item.node.name}</Text>
                    
                </View>
                <View>
                    <MaterialCommunityIcons name="magnify" size={10} style={styles.searchIcon} />
                </View>
            </TouchableOpacity>
        )
    }

    const footerComponent = () => {
        if (isFetching){
            return (<UIActivityIndicator  size={30} />);
        }

        if (showFullResults){
            return null;
        }
        
        return(
            <TouchableOpacity style={styles.footer} onPress={showAllResults}>
                <Text style={{color: primary}}>See all Results</Text>
            </TouchableOpacity>
        );
    }

    const showAllResults = () => {
        dispatch(setShowFullResults(true));
        if (!isLoading){
            dispatch(setSearchPageInfo(data!.pageInfo));
            dispatch(setRecordPerPage(10));
        }
    }

    const handleLoadMore = async () => {
        if (showFullResults){
            if (!isFetching){
                dispatch(setSearchPageInfo(data!.pageInfo));
            }
        }
    }
    
    if (isLoading){
        return (SearchLoader());
    }
    
    if (error != undefined){
        return (showError(error as string));
    }

    if (data!.edges.length == 0){
        return (<HistoryResults />);
    }

    return(
    <GestureHandlerRootView>
        <View style={styles.flashListStyle}>
            <FlashList
                data={data!.edges as Suggestions[] }
                keyExtractor={(item: Suggestions):string => item.node.id}
                renderItem={renderItem}
                ListFooterComponent={footerComponent}
                onEndReached={handleLoadMore}
                estimatedItemSize={200}
                estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
            />
        </View>
    </GestureHandlerRootView>);
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row',
      marginStart: 10,
      flexGrow: 1
    },
    footer: {
        alignItems: 'center',
        marginTop: 20
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginEnd: 20
    },
    avatar: {
        marginBottom: 20,
        marginEnd: 10
    },
    searchText: {
        top: 20,
        fontSize: 14,
    },
    searchIcon: {
        fontSize: 20,
        color: 'gray',
        top: 20,
    },
    searchDetails: {
        flexDirection: 'row'
    }
});
  
export default PreviewResults;
