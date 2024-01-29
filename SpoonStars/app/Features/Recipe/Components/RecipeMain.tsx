import React, { FC, useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../Redux/Hooks';
import { selectConfigStatus } from '../../Configuration/ConfigSlice';
import { selectRecipes, recipePayload, selectRecipesStatus, 
  selectRecipesPageInfo, clearRecipes, selectRecipeTags, 
  updateRecipePreference, saveRecipePreference, selectRecipePreferencesStatus } from '../Scripts/RecipeSlice';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ErrorMain } from '../../Error/ErrorMain';
import { selectConfigError } from '../../Configuration/ConfigSlice';
import loading from '../../Shared/Components/Loading';
import { HomeScreenProps } from './../../../../types/App_Types';
import { useAppTheme } from './../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigation } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeFeed from './RecipeFeed';
import { recipeApi } from '../../Api/RecipeApi';


const RecipeMain: FC<HomeScreenProps> = ( {navigation, route}: HomeScreenProps ) => {
  const { colors: { primary } } = useAppTheme();
  
  const recipeTags = useAppSelector(selectRecipeTags);
  const preferenceStatus = useAppSelector(selectRecipePreferencesStatus);
  const [tagStyles, setTagStyles] = useState<string[]>([]);
  const { RecipeLoader } = loading();
  const { navigate } = useNavigation<StackNavigation>();
  const autocompleteField = useRef<any>(null);
  
  const configStatusState = useAppSelector(selectConfigStatus);
  const configStateErrors: string = useAppSelector(selectConfigError);
  const dispatch = useAppDispatch();

  

  

  useEffect(() => {
    if (preferenceStatus === 'succeeded') {
      const modes = recipeTags.map(item => item.preferred == true ? 'white' : 'black'); 
      setTagStyles(modes);
    }
  }, [preferenceStatus]);

  
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
    dispatch(recipeApi.util.resetApiState());
    dispatch(clearRecipes());
    setTagStyles(nextStyles);
    dispatch(updateRecipePreference(index));
    dispatch(saveRecipePreference());
  };

  const handleSearchOnFocus = () => {
    autocompleteField.current.blur();
    navigate('Search');
  }

  if (configStateErrors !== '') {
    return (<ErrorMain message={configStateErrors} />);
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
      { configStatusState === 'succeeded' && <RecipeFeed /> }
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
