import { API_URL } from "@env";
import { ConfigState } from "./ConfigSlice";

const requestUrl = `${ API_URL }configuration`;

export const getConfig = () => {
    return new Promise((resolve, reject) => { fetch(requestUrl)
        .then(response => response.json()).catch(e => reject(e))
            .then(json => { 
                {
                    const config: ConfigState = {  
                        value: { suggesticAPIKey: json.suggesticAPIKey, suggesticUserId: json.suggesticUserId }
                    }
                    resolve(config);
                }
            }).catch(e => reject(e))
        });
}


