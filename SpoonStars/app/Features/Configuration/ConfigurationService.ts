import { API_URL } from "@env";
import { ConfigState } from "./ConfigSlice";

const requestUrl = `${ API_URL }configuration`;

export const getConfig = () => {
    return fetch(requestUrl)
        .then(response => response.json())
        .then(json => { 
            {
                const config: ConfigState = {  
                    suggesticAPIKey: json.suggesticAPIKey,
                    suggesticUserId: json.suggesticUserId
                }
                return config;
            }
        }).catch(e => console.error(e));
}


