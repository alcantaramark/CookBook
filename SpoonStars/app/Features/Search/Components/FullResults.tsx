import { FC, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, SegmentedButtons } from 'react-native-paper';
import { selectSearchSuggestions, suggestionsPayload, selectSearchStatus, selectSearchText, 
    selectSearchPageInfo, selectSearchErrors } from '../Scripts/SearchSlice';
import { useAppSelector, useAppDispatch } from './../../../Redux/Hooks';
import { useAppTheme } from './../../../App';
import MasonryList from '@react-native-seoul/masonry-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StackNavigation, Suggestions } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import useLoading from '../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { searchApi, useSuggestRecipesByNameQuery } from '../../Api/SearchApi';
import { UIActivityIndicator } from 'react-native-indicators';




export interface FullResultsProps{

}

const FullResults: FC<FullResultsProps> = () =>{
    const searchText = useAppSelector(selectSearchText);
    const dispatch = useAppDispatch();
    const [lastRecord, setLastRecord] = useState<string>("");
    const { showError } = useErrorHandler();
    const { navigate } = useNavigation<StackNavigation>();
    const { MasonryLoader } = useLoading();
    const { colors: { primary }} = useAppTheme();
    const [searchBy, setSearchBy] = useState<string>('name');
    //RTK Query
    const { data, isLoading, error, refetch } = useSuggestRecipesByNameQuery({
        query: searchText,
        recordPerPage: 50,
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

    

    const footer = () =>{
        if (isLoading){
            return (<UIActivityIndicator size={30} />);
        }
    }   

    const handleLoadMore = async () => {
        if (!isLoading){
            setLastRecord(data!.pageInfo.endCursor);
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
            <View style={{ backgroundColor: primary }}>
                <SegmentedButtons 
                    value={searchBy}
                    style={styles.searchBy}
                    buttons={[
                    { value: 'name', label: 'Name', checkedColor: primary },
                    { value: 'ingredients', label: 'Ingredients', checkedColor: primary }
                    ]}
                    onValueChange={(val) => console.log(val)}
                    density='high'
                    theme={useAppTheme}
                />
            </View>
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
    },
    searchBy: {
        height: 28,
        margin: 10,
        borderRadius: 10,
        
    }
});

export default FullResults;