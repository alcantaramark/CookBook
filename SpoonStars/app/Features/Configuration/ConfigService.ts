import Config from "react-native-config";

const requestUrl = `${ Config.API_URL }configuration`;

export const fetchApiConfig = async () => {
    return await fetch(requestUrl);
}