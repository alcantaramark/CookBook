
import { FC } from 'react'
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';


interface ErrorMainProps{
    message: string;
}

export const ErrorMain: FC<ErrorMainProps> = ({ message }) => {
  return (
    <Text style={styles.ErrorMessage}>{ message }</Text>
  )
}

const styles = StyleSheet.create({
  ErrorMessage: {
    padding: 100,
    textAlign: 'center',
  }
})

