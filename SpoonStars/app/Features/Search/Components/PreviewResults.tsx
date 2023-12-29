import React, { FC, ReactElement, useEffect } from 'react'
import { StyleSheet, View , FlatList} from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { selectSearchSuggestions, suggestionsPayload, selectSearchStatus, selectSearchHistoryStatus } from '../SearchSlice';
import { useAppSelector } from '../../../Redux/Hooks';
import HistoryResults from './HistoryResults';
import { useAppTheme } from '../../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import { type StackNavigation } from './../../Recipe/Components/RecipeHeader';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';


interface PreviewResultsProps {}


const PreviewResults: FC<PreviewResultsProps> = () => {
    const searchSuggestions = useAppSelector(selectSearchSuggestions);
    const searchHistoryStatus = useAppSelector(selectSearchHistoryStatus);
    //const { navigate } = useNavigation<StackNavigation>();
    
    const { colors: { primary }} = useAppTheme();    
    

    const renderItem = ({item}: { item: suggestionsPayload, index?:number }): ReactElement => {
        return (
            <TouchableOpacity style={styles.itemContainer} >
                <View style={styles.searchDetails}>
                    <Avatar.Image source={{ uri: item.node.mainImage }} size={50} style={styles.avatar}/>
                    <Text style={styles.searchText} numberOfLines={1}>{item.node.name}</Text>
                    
                </View>
                <View>
                    <MaterialCommunityIcons name="magnify" size={10} style={styles.searchIcon} />
                </View>
            </TouchableOpacity>
        )
    }

    const footerComponent = () => {
        return(
            <View style={styles.footer}>
                <Text style={{color: primary}}>See all Results</Text>
            </View>
        );
    }

    return(
    <GestureHandlerRootView>
        <View style={styles.flashListStyle}>
            { (searchHistoryStatus === 'succeeded') &&
                <FlatList
                    ListEmptyComponent={<HistoryResults />}
                    data={searchSuggestions}
                    keyExtractor={(item: suggestionsPayload):string => item.node.id}
                    renderItem={renderItem}
                    ListFooterComponent={searchSuggestions.length == 0 ? null : footerComponent}
                />
            }
        </View>
    </GestureHandlerRootView>);
}

const styles = StyleSheet.create({
    flashListStyle: {
      marginTop: 20,
      flexDirection: 'row',
      marginStart: 10,
      marginEnd: 10
    },
    footer: {
        alignItems: 'center',
        marginTop: 20
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    avatar: {
        marginBottom: 20,
        marginEnd: 10
    },
    searchText: {
        top: 20,
        fontSize: 14,
    },
    searchIcon: {
        fontSize: 20,
        color: 'gray',
        top: 20,
    },
    searchDetails: {
        flexDirection: 'row'
    }
});
  
export default PreviewResults;
