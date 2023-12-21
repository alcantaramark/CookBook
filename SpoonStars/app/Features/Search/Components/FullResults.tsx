import RFS, { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export interface FullResultsProps{

}

const FullResults: FC<FullResultsProps> = () =>{
    return (
        <View>
            <Text>Showing Full Results</Text>
        </View>
    );
}

export default FullResults;