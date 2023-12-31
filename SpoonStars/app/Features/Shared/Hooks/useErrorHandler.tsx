import { Text } from "react-native-paper";


const useErrorHandler = () => {
    const showError = (message: string) => {
        return (
            <Text>{message}</Text>
        );
    }

    return { showError }
}

export default useErrorHandler;