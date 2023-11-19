import { API_URL } from "@env";

const requestUrl = `${ API_URL }configuration`;

export const fetchApiConfig = async () => {
    return await fetch(requestUrl);
}