import { FC, useState, useEffect, useRef } from 'react'
import { TextInput } from 'react-native-paper'
import { Dimensions, NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View, unstable_batchedUpdates } from 'react-native';
import useDebounce from '../../Shared/Hooks/useDebounce';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveSearchHistory, selectSearchText, setShowFullResults, selectShowFullResults, selectIsSearching,
setShowListResults, setSearchText } from '../Scripts/SearchSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';
import SearchHelper from '../Scripts/useSearch';
import { StackNavigation } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import { searchApi } from '../../Api/SearchApi';

interface SearchBarProps{

}

const SearchBar: FC<SearchBarProps> = () => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedValue = useDebounce<string>(searchValue, 1000);
    const autocompleteField = useRef<any>(null);
    const { navigate } = useNavigation<StackNavigation>();
    
    
    const dispatch = useAppDispatch();

    const handleSearchOnFocus = async () => {
      }
    
    const handleInputSearchChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSearchValue(e.nativeEvent.text);
    }

    const handleOnBlur = () => {
    }

    const handleOnSubmit = async () => {
      await dispatch(saveSearchHistory(searchValue));
      dispatch(setShowFullResults(true));
    }

    useEffect(() => {
      dispatch(searchApi.util.resetApiState());
      dispatch(setSearchText(searchValue));
      dispatch(setShowListResults(searchValue === '' ? false : true));
    }, [debouncedValue])

    useEffect(() => autocompleteField.current.focus(), []);

    const handleBackOnPress = () => {
      dispatch(setShowListResults(false));
      dispatch(searchApi.util.resetApiState());
      dispatch(setSearchText(''));
      dispatch(setShowFullResults(false));
      navigate('Home');
    }

    return (
        <View style={styles.searchInput}>
            <TextInput
                theme={{ roundness: 10 }}
                ref={autocompleteField}
                placeholder='search recipes...'
                value={searchValue}
                style={ styles.searchInputField }
                onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => handleInputSearchChange(e)}
                mode='outlined'
                onFocus={handleSearchOnFocus}
                onSubmitEditing={handleOnSubmit}
                onBlur={handleOnBlur}
                blurOnSubmit={false}
                left={ 
                  <TextInput.Icon icon={() => <MaterialCommunityIcons 
                      name='arrow-left-thin' 
                      onPress={handleBackOnPress} 
                      style={styles.searchIconBack}
                      />}
                  />
                }
            />
          </View>
    );
}

const styles = StyleSheet.create({
    searchInputField: {
        width: Dimensions.get('screen').width - 20,
        height: 40,
        marginStart: 10,
      },
      searchInputFieldActive: {
        width: Dimensions.get('screen').width - 52,
        height: 40,
        marginStart: 5,
      },
      searchIconMagnify: {
        color: 'gray',
        fontSize: 25,
      },
      searchInput: {
        flexDirection: 'row',
      },
      searchIconBack: {
        color: 'gray',
        fontSize: 30
      }
      
});

export default SearchBar;