import { FC, useState, useEffect, useRef } from 'react'
import { TextInput } from 'react-native-paper'
import { Dimensions, NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import useDebounce from '../../Shared/Hooks/useDebounce';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveSearchHistory, setShowFullResults, 
setShowListResults, setSearchText, 
setRecordPerPage,
clearPaging, selectSearchBy } from '../Scripts/SearchSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';
import { StackNavigation } from './../../../../types/App_Types';
import { useNavigation } from '@react-navigation/native';
import { searchApi } from '../../Api/SearchApi';

interface SearchBarProps{

}

const SearchBar: FC<SearchBarProps> = () => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedValue = useDebounce<string>(searchValue, 1000);
    const autocompleteField = useRef<any>(null);
    const searchBy = useAppSelector(selectSearchBy);
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
      dispatch(setRecordPerPage(10));
    }

    useEffect(() => {
      dispatch(searchApi.util.resetApiState());
      dispatch(setSearchText(searchValue));
      if (searchValue === ''){
        dispatch(setShowListResults(false));
        dispatch(setShowFullResults(false));
        dispatch(setRecordPerPage(50));
        dispatch(clearPaging());
      }
      else {
        dispatch(setShowListResults(true));
        dispatch(setRecordPerPage(5));
      }
      
    }, [debouncedValue])

    useEffect(() => autocompleteField.current.focus(), []);

    const handleBackOnPress = () => {
      dispatch(setShowListResults(false));
      dispatch(searchApi.util.resetApiState());
      dispatch(setSearchText(''));
      dispatch(setShowFullResults(false));
      dispatch(setRecordPerPage(50));
      navigate('Home');
    }

    return (
        <View style={styles.searchInput}>
            <TextInput
                theme={{ roundness: 10 }}
                ref={autocompleteField}
                placeholder={ searchBy === 'name' ? "search recipes..." : 'e.g. broccoli, carrots' }
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