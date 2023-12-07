import React, { FC, createContext, useEffect, useState } from 'react';
import { Searchbar, Chip } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useAppTheme } from '../../../App'

interface RecipeHeaderProps {}

export const HomeContext = createContext(null as any);

const RecipeHeader: FC<RecipeHeaderProps> = () => { 
  const [searchText, setSearchText] = useState('');
  const { colors: { primary } } = useAppTheme();
  const [tagColor, setTagColor] = useState(primary);

  const styles = StyleSheet.create({
    recipeTag: {
      marginHorizontal: 5,
      backgroundColor: primary
    },
    container: {
      backgroundColor: primary
    },
    header: {
      backgroundColor: 'transparent'
    },
    searchInput: {
      backgroundColor: 'white',
      marginHorizontal: 10,
      marginVertical: 10,
      height: 50
    },
    scroll: {
      marginTop: 5,
      marginBottom: 10
    }
  })

  return (
    <>
      <View style={styles.container} >
        <Searchbar placeholder='search recipe...' 
          onChangeText={(text) => setSearchText(text)} value={searchText}
          style={styles.searchInput} mode='bar'  />
        <GestureHandlerRootView>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scroll}>
              <Chip mode='flat' style={styles.recipeTag} onPress={() => {}} showSelectedCheck={true} compact={true}>Breakfast</Chip>
              <Chip mode='flat' style={styles.recipeTag} compact={true}>Balanced</Chip>
              <Chip mode='flat' style={styles.recipeTag} compact={true}>Appetizer</Chip>
              <Chip mode='flat' style={styles.recipeTag} compact={true}>Snacks</Chip>
            </ScrollView>
        </GestureHandlerRootView> 
      </View> 
    </>
)};

export default RecipeHeader;
