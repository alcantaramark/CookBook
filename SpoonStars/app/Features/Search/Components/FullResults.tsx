import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import { selectSearchSuggestions, suggestionsPayload, selectSearchStatus, selectSearchText, selectSearchPageInfo, selectSearchErrors } from '../SearchSlice';
import { useAppSelector } from './../../../Redux/Hooks';
import MasonryList from '@react-native-seoul/masonry-list';
import useSearch from '../Hooks/useSearch';
import { UIActivityIndicator } from 'react-native-indicators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackNavigation } from './../../../App';
import { useNavigation } from '@react-navigation/native';
import useLoading from './../../Shared/Hooks/useLoading';
import useErrorHandler from '../../Shared/Hooks/useErrorHandler';
export interface FullResultsProps{

}



const FullResults: FC<FullResultsProps> = () =>{
    const searchSuggestions = useAppSelector(selectSearchSuggestions);
    const searchText = useAppSelector(selectSearchText);
    const searchStatus = useAppSelector(selectSearchStatus);
    const searchPageInfo = useAppSelector(selectSearchPageInfo);
    const searchErrors = useAppSelector(selectSearchErrors);

    const { search } = useSearch();
    const { showError } = useErrorHandler();
    const { navigate } = useNavigation<StackNavigation>();
    const { MasonryLoader } = useLoading();

    const renderSuggestions = (({item}:any) => {
        const randomBool = Math.random() < 0.5;
        return(
            <TouchableOpacity onPress={() => navigate('Details')}>
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

    const handleLoadMore = async () => {
        if ((searchStatus === 'succeeded' || searchStatus === 'idle') && searchPageInfo.hasNextPage) {
            await search(true, searchText);
        }
    }

    const footer = () =>{
        if (searchStatus === 'loading' && searchSuggestions.length > 0)
            return (<UIActivityIndicator size={30} />)
    }   

    return (
        <GestureHandlerRootView>
            <View style={styles.flashListStyle}>
                { searchErrors === '' ? 
                    <MasonryList
                        data={searchSuggestions}
                        numColumns={3}
                        keyExtractor={(item: suggestionsPayload) => item.node.id}
                        renderItem={renderSuggestions}
                        style={{alignSelf: 'stretch'}}
                        contentContainerStyle={{
                            alignSelf: 'stretch'
                        }}
                        onEndReachedThreshold={0.8}
                        onEndReached={handleLoadMore}
                        onRefresh={() => search(true, searchText)}
                        ListFooterComponent={footer()}
                        ListEmptyComponent={MasonryLoader()}
                    /> : showError(searchErrors)
                }
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