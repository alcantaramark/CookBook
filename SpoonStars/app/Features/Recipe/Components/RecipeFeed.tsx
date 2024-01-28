import React, { FC, ReactElement } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Suggestions } from './../../../../types/App_Types';
import RecipeItem from './RecipeItem';
import useFeed from '../Scripts/useFeed';
import loading from './../../Shared/Components/Loading';
import useErrorHandler from '../../Shared/Components/ErrorHandler';

interface RecipeFeedProps{

}

const RecipeFeed: FC<RecipeFeedProps> = () => {
    const { data, isLoading, error, refetch } = useFeed();
    const { RecipeLoader } = loading();
    const { showError } = useErrorHandler();
    

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

    return(
        <GestureHandlerRootView>
            <View style={styles.flashlistStyle}>
            <FlashList
              keyExtractor = {(item: Suggestions): string => item.node.id}
              numColumns = {1}
              data= { data!.edges as Suggestions[]}
              renderItem={renderItem}
              horizontal={false}
              //onEndReached={loadMore}
              // ListFooterComponent={footer}
              estimatedItemSize={200}
              estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
            //   refreshControl={
            //     <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} 
            //     style={{backgroundColor: 'transparent'}}
            //     title='Fetching Recipes...' titleColor={'black'} tintColor={"black"}
            //     />
            //   }
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