import { FC } from 'react'
import ContentLoader from 'react-content-loader/native';
import { Circle, Rect } from 'react-native-svg';



const useLoading = () => {
  
  const RecipeLoader = () => {
    return (
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
    );
  }

  const SearchLoader = () => {
    return(
      <ContentLoader
        width={500}
        height={600}
        viewBox="0 0 600 800"
        backgroundColor="#d6d6d6"
        foregroundColor="#aaaaaa"
      >
        <Rect x="50" y="19" rx="6" ry="20" width="400" height="15" />
        <Circle cx="15" cy="22" r="15" />
        <Rect x="50" y="80" rx="6" ry="6" width="400" height="15" />
        <Circle cx="15" cy="82" r="15" />
        <Rect x="50" y="137" rx="6" ry="6" width="400" height="15" />
        <Circle cx="15" cy="140" r="15" />
        <Rect x="50" y="195" rx="6" ry="6" width="400" height="15" />
        <Circle cx="15" cy="200" r="15" />
        <Rect x="50" y="255" rx="6" ry="6" width="400" height="15" />
        <Circle cx="15" cy="258" r="15" />
      </ContentLoader>
    );
  }

  return {RecipeLoader, SearchLoader};
}

export default useLoading;