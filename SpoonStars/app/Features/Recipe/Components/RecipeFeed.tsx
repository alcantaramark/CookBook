import React, { FC, ReactElement, useState } from 'react';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Suggestions } from './../../../../types/App_Types';
import RecipeItem from './RecipeItem';
import useFeed from '../Scripts/useFeed';
import loading from './../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';
import { UIActivityIndicator } from 'react-native-indicators';
import { useAppDispatch } from '../../../Redux/Hooks';
import { setRecordPerPage, setRecipePageInfo } from '../Scripts/RecipeSlice';
import { recipeApi } from '../../Api/RecipeApi';

interface RecipeFeedProps{

}

const RecipeFeed: FC<RecipeFeedProps> = () => {
    const { data, isLoading, error, refetch } = useFeed();
    const { RecipeLoader } = loading();
    const { showError } = useErrorHandler();
    const dispatch = useAppDispatch();
    const [refreshing, setRefreshing] = useState(false);
    

    const renderItem = ({item}:{
        item: Suggestions;
        index?: number;
      }): ReactElement => {
        return (
          <RecipeItem item={item}  />
        );
      };

    if (isLoading){
        return(RecipeLoader());
    }

    if (error != undefined){
        return (showError(error as string));
    }

    const footer = () =>{
      if (isLoading){
          return (<UIActivityIndicator size={30} />);
      }
    }

    const handleLoadMore = async () => {
      if (!isLoading){
          dispatch(setRecordPerPage(10));
          dispatch(setRecipePageInfo(data!.pageInfo));
      }
    }

    const handleOnRefresh = () => {
      setRefreshing(true);
      dispatch(recipeApi.util.resetApiState());
      refetch();
      setRefreshing(false);
  }

    return(
        <GestureHandlerRootView>
            <View style={styles.flashlistStyle}>
            <FlashList
              keyExtractor = {(item: Suggestions): string => item.node.id}
              numColumns = {1}
              data= { data!.edges as Suggestions[]}
              renderItem={renderItem}
              horizontal={false}
              ListFooterComponent={footer}
              estimatedItemSize={200}
              estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
              onEndReached={handleLoadMore}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}
            />
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    flashlistStyle: {
        marginTop: 10,
        flexDirection: 'row'
    }
});

export default RecipeFeed;