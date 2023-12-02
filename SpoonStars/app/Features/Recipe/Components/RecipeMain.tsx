import React, { FC, useEffect, ReactElement, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig, selectConfigStatus } from '../../Configuration/ConfigSlice';
import { selectRecipes, recipe, fetchPopularRecipes, selectRecipesStatus, clearPaging } from '../RecipeSlice';
import RecipeItem from './RecipeItem';
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import RecipeHeader from './RecipeHeader';
import { UIActivityIndicator } from 'react-native-indicators';
import { ActivityIndicator, StyleSheet } from 'react-native';


interface RecipeMainProps {}


const RecipeMain: FC<RecipeMainProps> = () => {
  const recipesState: recipe[] = useAppSelector(selectRecipes);
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({item}:{
    item: recipe;
    index?: number;
  }): ReactElement => {
    return (
      <RecipeItem item={item}  />
    );
  };
  
  const configState = useAppSelector(selectConfig);
  const configStatusState = useAppSelector(selectConfigStatus);
  const recipeStatusState = useAppSelector(selectRecipesStatus);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (configStatusState === 'succeeded'){
      dispatch(fetchPopularRecipes());
    }
  }, [configState])
  
  const loadMore = async ()=> {
    if (recipeStatusState === 'succeeded') {
      await dispatch(fetchPopularRecipes());
    }
  }

  const footer = () => {
    if (recipeStatusState !== 'loading') 
      return null;
    return (<UIActivityIndicator size={30} />)
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(clearPaging());
    await dispatch(fetchPopularRecipes());
    setRefreshing(false);
  }

  return(
    <>
      <RecipeHeader />
      <GestureHandlerRootView>
        <FlatList
              keyExtractor = {(item: recipe): string => item.node.id}
              numColumns = {1}
              data= { recipesState }
              renderItem={renderItem}
              horizontal={false}
              onEndReached={loadMore}
              ListFooterComponent={footer}
              style={styles.flatListStyle}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} 
                style={{backgroundColor: 'transparent'}}
                title='Fetching Recipes...' titleColor={'black'} tintColor={"black"}
                />
              }
        />
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  flatListStyle: {
    marginTop: 20
  }
})

export default RecipeMain;
