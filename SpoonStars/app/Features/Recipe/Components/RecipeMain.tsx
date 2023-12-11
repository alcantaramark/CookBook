import React, { FC, useEffect, ReactElement, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig, selectConfigStatus } from '../../Configuration/ConfigSlice';
import { selectRecipes, recipe, fetchRecipes, selectRecipesStatus, clearPaging, selectRecipesPageInfo } from '../RecipeSlice';
import RecipeItem from './RecipeItem';
import { FlatList, GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';
import { StyleSheet } from 'react-native';
import ContentLoader from 'react-content-loader/native';
import { Rect } from 'react-native-svg';

interface RecipeMainProps {}


const RecipeMain: FC<RecipeMainProps> = () => {
  const recipesState: recipe[] = useAppSelector(selectRecipes);
  const [refreshing, setRefreshing] = useState(false);

  const recipeLoader = () => (
    <ContentLoader
      width={500}
      height={600}
      viewBox="0 0 600 800"
      backgroundColor="#d6d6d6"
      foregroundColor="#aaaaaa"
    >
    <Rect x="0" y="630" rx="10" ry="10" width="450" height="217" />
    <Rect x="0" y="560" rx="3" ry="3" width="330" height="6" />
    <Rect x="0" y="580" rx="4" ry="4" width="250" height="9" />
    <Rect x="0" y="330" rx="10" ry="10" width="450" height="217" />
    <Rect x="0" y="270" rx="4" ry="4" width="250" height="9" />
    <Rect x="0" y="250" rx="3" ry="3" width="330" height="6" />
    <Rect x="0" y="20" rx="10" ry="10" width="450" height="217" />
  </ContentLoader>
  )
  

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
  const recipePageInfo = useAppSelector(selectRecipesPageInfo);
  
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (configStatusState === 'succeeded'){
      dispatch(fetchRecipes());
    }
  }, [configState])
  
  useEffect(() => {
    
  }, [recipesState])

  const loadMore = async ()=> {
    if ((recipeStatusState === 'succeeded' || recipeStatusState === 'idle') && recipePageInfo.hasNextPage) {
      await dispatch(fetchRecipes());
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
    await dispatch(fetchRecipes());
    setRefreshing(false);
  }

  return(
    <>
      <GestureHandlerRootView>
        {
          (recipeStatusState === 'loading' 
            || configStatusState === 'loading') && recipesState.length == 0 ? recipeLoader() :
          <FlatList
                keyExtractor = {(item: recipe): string => item.node.id}
                numColumns = {1}
                data= { recipesState }
                renderItem={renderItem}
                horizontal={false}
                onEndReached={loadMore}
                ListFooterComponent={footer}
                style={styles.flatListStyle}
                initialNumToRender={4}
                removeClippedSubviews={true}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} 
                  style={{backgroundColor: 'transparent'}}
                  title='Fetching Recipes...' titleColor={'black'} tintColor={"black"}
                  />
                }
          />
        }
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  flatListStyle: {
    marginTop: 20
  },
  skeleton: {
    margin: 10  
  }
})

export default RecipeMain;
