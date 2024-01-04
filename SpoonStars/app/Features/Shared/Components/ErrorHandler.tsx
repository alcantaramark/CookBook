import { Text } from "react-native-paper";


const ErrorHandler = () => {
    const showError = (message: string) => {
        return (
            <Text>{message}</Text>
        );
    }

    return { showError }
}

export default ErrorHandler;