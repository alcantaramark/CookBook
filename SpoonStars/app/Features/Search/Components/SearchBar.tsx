import { FC, useState, useEffect, useRef } from 'react'
import { TextInput } from 'react-native-paper'
import { Dimensions, NativeSyntheticEvent, StyleSheet, TextInputChangeEventData, View } from 'react-native';
import useDebounce from '../../Shared/Hooks/useDebounce';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveSearchHistory, selectSearchText, setShowFullResults, selectIsSearching, setIsSearching,
clearPaging, setShowListResults, setSearchText } from '../Scripts/SearchSlice';
import { useAppDispatch, useAppSelector } from './../../../Redux/Hooks';
import SearchHelper from './../Scripts/Search';

interface SearchBarProps{

}

const SearchBar: FC<SearchBarProps> = () => {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedValue = useDebounce<string>(searchValue, 1000);
    const autocompleteField = useRef<any>(null);
    const { search } = SearchHelper();
    
    const searchText = useAppSelector(selectSearchText);
    const isSearching = useAppSelector(selectIsSearching);
    const dispatch = useAppDispatch();

    const handleSearchOnFocus = async () => {
        if (searchText == ''){
          dispatch(setIsSearching(true)) ;
          dispatch(setShowFullResults(true));
          search(true, searchText);
        }
      }

    const handleInputSearchChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        setSearchValue(e.nativeEvent.text);
    }

    const handleOnBlur = () => {
        setSearchValue('');
        dispatch(setIsSearching(false));
        dispatch(setSearchText(''));
        autocompleteField.current.setNativeProps({ text : "" });
    }

    const handleOnSubmit = async () => {
        await dispatch(saveSearchHistory(searchText));  
        performSearch(searchText);
    }

    const performSearch =  async (text: string) => {
        if (!isSearching)
          return;
    
        dispatch(setIsSearching(true));

        if (searchText === text){ //enter pressed
          dispatch(setShowFullResults(false));
          dispatch(setShowListResults(true));
          dispatch(clearPaging());
          search(true, text);
        }
        else { //normal course of typing and searching
          dispatch(setShowFullResults(false));
          dispatch(setShowListResults(false));
          search(false, text);
        }
      }


    useEffect(() => {
        performSearch(debouncedValue);
    }, [debouncedValue])


    return (
        <View style={styles.searchInput}>
          {isSearching &&
            <MaterialCommunityIcons 
              name='arrow-left-thin' style={styles.searchIconBack} 
              onPress={() => autocompleteField.current.blur()}
            />
          }
            <TextInput
                theme={{ roundness: 10 }}
                ref={autocompleteField}
                placeholder='search recipes...'
                value={searchValue}
                style={ isSearching ? styles.searchInputFieldActive : styles.searchInputField }
                onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => handleInputSearchChange(e)}
                mode='outlined'
                left={ !isSearching &&
                    <TextInput.Icon 
                    icon={() => <MaterialCommunityIcons name='magnify' style={styles.searchIconMagnify} /> }  
                    />
                }
                onFocus={handleSearchOnFocus}
                onSubmitEditing={handleOnSubmit}
                onBlur={handleOnBlur}
                blurOnSubmit={false}
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
        fontSize: 30,
        top: 8,
        marginStart: 10
      }
      
});

export default SearchBar;