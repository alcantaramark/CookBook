import { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import { selectSearchSuggestions, suggestionsPayload, selectSearchStatus, selectSearchText, selectSearchPageInfo, selectSearchErrors } from '../Scripts/SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import MasonryList from '@react-native-seoul/masonry-list';
import SearchHelper from '../Scripts/Search';
import { UIActivityIndicator } from 'react-native-indicators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackNavigation, Suggestions } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import useLoading from '../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { useSuggestRecipesQuery } from '../../Api/SearchApi'


export interface FullResultsProps{

}

const FullResults: FC<FullResultsProps> = () =>{
    //const searchSuggestions = useAppSelector(selectSearchSuggestions);
    const searchText = useAppSelector(selectSearchText);
    // const searchStatus = useAppSelector(selectSearchStatus);
    // const searchPageInfo = useAppSelector(selectSearchPageInfo);
    // const searchErrors = useAppSelector(selectSearchErrors);

    //const { search } = SearchHelper();
    const [lastRecord, setLastRecord] = useState<string>("");
    const { showError } = useErrorHandler();
    const { navigate } = useNavigation<StackNavigation>();
    const { MasonryLoader } = useLoading();
    
    //RTK Query
    const { data, isLoading, error, refetch } = useSuggestRecipesQuery({
        query: searchText,
        recordPerPage: 20,
        endCursor: lastRecord
    })
    
    const renderSuggestions = (({item}:any) => {
        const randomBool = Math.random() < 0.5;
        return(
            <TouchableOpacity onPress={() => navigate('Details', {id: 'test id'})}>
                <Card style={styles.cardStyle}>
                    <Card.Cover source={{ uri: item.node.mainImage }} style={{
                        height: randomBool ? 100 : 230,
                        alignSelf: 'stretch',
                        borderRadius: 0
                    }} />
                </Card>
            </TouchableOpacity>
        );
    })

    // const handleLoadMore = async () => {
    //     if ((searchStatus === 'succeeded' || searchStatus === 'idle') && searchPageInfo.hasNextPage) {
    //         await search(true, searchText);
    //     }
    // }

    // const footer = () =>{
    //     if (searchStatus === 'loading' && searchSuggestions.length > 0)
    //         return (<UIActivityIndicator size={30} />)
    // }   

    
    // if (searchErrors !== '')
    //     return showError(searchErrors);
    // if (searchStatus === 'loading')
    //     return MasonryLoader();

    const handleLoadMore = async () => {
        setLastRecord(data!.pageInfo.endCursor);
    }

    if (isLoading){
        return (MasonryLoader());
    }

    if (error != undefined){
        return (showError(error as string));
    }
    console.log(data);

    return (
        <GestureHandlerRootView>
            <View style={styles.flashListStyle}>
                <MasonryList
                    data={data?.edges as Suggestions[]}
                    numColumns={3}
                    keyExtractor={(item: Suggestions) => item.node.id}
                    renderItem={renderSuggestions}
                    style={{alignSelf: 'stretch'}}
                    contentContainerStyle={{
                        alignSelf: 'stretch'
                    }}
                    onRefresh={() => refetch()}
                    onEndReachedThreshold={0.8}
                    onEndReached={handleLoadMore}
                    // ListFooterComponent={footer()}
                /> 
            </View> 
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 0,
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