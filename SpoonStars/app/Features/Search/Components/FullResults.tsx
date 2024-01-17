import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useAppDispatch } from '../../../Redux/Hooks';
import MasonryList from '@react-native-seoul/masonry-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackNavigation, Suggestions } from '../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import useLoading from '../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { searchApi } from '../../Api/SearchApi';
import { UIActivityIndicator } from 'react-native-indicators';
import useSearch from '../Scripts/useSearch';
import { setRecordPerPage, setSearchPageInfo } from '../Scripts/SearchSlice';




export interface FullResultsProps{

}

const FullResults: FC<FullResultsProps> = () =>{
    const dispatch = useAppDispatch();
    const { showError } = useErrorHandler();
    const { navigate } = useNavigation<StackNavigation>();
    const { MasonryLoader } = useLoading();
    
    //RTK Query
    const { data, isLoading, error, refetch } = useSearch();
    
    const renderSuggestions = (({item, i}: any) => {
        const randomBool = Math.random() < 0.5;
        return(
            <TouchableOpacity onPress={() => navigate('Details', {id: item.node.id})}>
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

    

    const footer = () =>{
        if (isLoading){
            return (<UIActivityIndicator size={30} />);
        }
    }   

    const handleLoadMore = async () => {
        if (!isLoading){
            dispatch(setRecordPerPage(50));
            dispatch(setSearchPageInfo(data!.pageInfo));
        }
    }

    const handleOnRefresh = () => {
        dispatch(searchApi.util.resetApiState());
        refetch();
    }

    if (isLoading){
        return (MasonryLoader());
    }

    if (error != undefined){
        return (showError(error as string));
    }

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
                    onRefresh={handleOnRefresh}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={footer()}
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