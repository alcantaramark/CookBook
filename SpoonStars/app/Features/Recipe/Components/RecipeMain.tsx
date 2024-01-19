import React, { FC, useEffect, ReactElement, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfig, selectConfigStatus } from '../../Configuration/ConfigSlice';
import { selectRecipes, recipePayload, fetchRecipes, selectRecipesStatus, 
  selectRecipesPageInfo, selectRecipeErrors, clearRecipes, selectRecipeTags, 
  updateRecipePreference, saveRecipePreference, selectRecipePreferencesStatus } from '../Scripts/RecipeSlice';
import RecipeItem from './RecipeItem';
import { GestureHandlerRootView, RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ErrorMain } from '../../Error/ErrorMain';
import { FlashList } from '@shopify/flash-list';
import { selectConfigError } from '../../Configuration/ConfigSlice';
import loading from '../../Shared/Components/Loading';
import { HomeScreenProps } from './../../../../types/App_Types';
import { useAppTheme } from './../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigation } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


const RecipeMain: FC<HomeScreenProps> = ( {navigation, route}: HomeScreenProps ) => {
  const { colors: { primary } } = useAppTheme();
  const recipesState: recipePayload[] = useAppSelector(selectRecipes);
  const recipeTags = useAppSelector(selectRecipeTags);
  const preferenceStatus = useAppSelector(selectRecipePreferencesStatus);
  const [refreshing, setRefreshing] = useState(false);
  const [tagStyles, setTagStyles] = useState<string[]>([]);
  const flashList = useRef(null);
  const { RecipeLoader } = loading();
  const { navigate } = useNavigation<StackNavigation>();
  const autocompleteField = useRef<any>(null);
  
  const renderItem = ({item}:{
    item: recipePayload;
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
  const recipeStateErrors = useAppSelector(selectRecipeErrors);
  const configStateErrors: string = useAppSelector(selectConfigError);
  
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

  useEffect(() => {
    if (preferenceStatus === 'succeeded') {
      const modes = recipeTags.map(item => item.preferred == true ? 'white' : 'black'); 
      setTagStyles(modes);
    }
  }, [preferenceStatus]);

  const footer = () => {
    if (recipeStatusState !== 'loading') 
      return null;
    return (<UIActivityIndicator size={30} />)
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(clearRecipes());
    await dispatch(fetchRecipes());
    setRefreshing(false);
  }
  
  const createPreferenceOptions = () => {
    return ( 
      recipeTags.map((item, index) => {
        return (
          <Button 
            compact={true} 
            textColor={tagStyles[index]}
            mode='text'
            onPress={() => handlePreferencePress(index)} 
            key={index}>{item.name}
          </Button>
        )
      })
    )
  }

  const handlePreferencePress = (index: number) => {
    const nextStyles = tagStyles.map((item, i) => {
      if (index == i) {
        item = item === 'white' ? 'black' : 'white';
      }
      else {
        item = 'black';
      }
      return item;
    });

    dispatch(clearRecipes());
    setTagStyles(nextStyles);
    dispatch(updateRecipePreference(index));
    dispatch(saveRecipePreference());
    dispatch(fetchRecipes());
  };

  const handleSearchOnFocus = () => {
    autocompleteField.current.blur();
    navigate('Search');
  }

  return(
    <>
    <SafeAreaView style={[{ backgroundColor: primary }]}/>
    <View style={[styles.container]}>
      <GestureHandlerRootView style={{ backgroundColor: primary }}>
        <TextInput
            theme={{roundness: 10}}
            mode='outlined'
            placeholder='search recipes...'
            style={styles.searchInputField}
            ref={autocompleteField}
            left={ 
              <TextInput.Icon 
                icon={() => <MaterialCommunityIcons name='magnify' style={styles.searchIconMagnify} /> }  
              />
            }
            onFocus={handleSearchOnFocus}
          />
        <ScrollView horizontal={true} 
              showsHorizontalScrollIndicator={false} 
              style={[styles.scroll, { backgroundColor: primary }]}
        >
          { createPreferenceOptions() }
        </ScrollView>
      </GestureHandlerRootView>
        {
          (recipeStatusState === 'loading'  || configStatusState === 'loading') && recipesState.length == 0 
              ? RecipeLoader() : configStateErrors !== '' ? <ErrorMain message={configStateErrors}/> :
              recipeStateErrors !== '' ? <ErrorMain message={recipeStateErrors}/> :
              <GestureHandlerRootView>
                  <View style={styles.flashListStyle}>
                      <FlashList
                            ref={flashList}
                            keyExtractor = {(item: recipePayload): string => item.node.id}
                            numColumns = {1}
                            data= { recipesState }
                            renderItem={renderItem}
                            horizontal={false}
                            onEndReached={loadMore}
                            ListFooterComponent={footer}
                            estimatedItemSize={200}
                            estimatedListSize={{ height: 200, width: Dimensions.get('screen').width }}
                            refreshControl={
                              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} 
                              style={{backgroundColor: 'transparent'}}
                              title='Fetching Recipes...' titleColor={'black'} tintColor={"black"}
                              />
                            }
                      />
                  </View>
                  </GestureHandlerRootView>
        }
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  flashListStyle: {
    marginTop: 10,
    flexDirection: 'row'
  },
  skeleton: {
    margin: 10  
  },
  scroll: {
    
  },
  container: {
    top: StatusBar.currentHeight! - 35
  },
  header: {
    height: StatusBar.currentHeight
  },
  searchInput: {
    flexDirection: 'row'
  },
  searchInputField: {
    width: Dimensions.get('screen').width - 20,
    height: 35,
    marginStart: 10
  },
  searchIconMagnify: {
    color: 'gray',
    fontSize: 25,
  }
});

export default RecipeMain;
