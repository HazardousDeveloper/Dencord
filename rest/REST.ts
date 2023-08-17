import Client from "../client/Client.ts";
import { Constants } from "../constants/enums.ts";
import * as logs from "../utilities/logging.ts";

export default class RESTapi {
    constructor(private client: Client, private headers: any) {

    }

    async request(endpoint: string,method: string,data?: any) : Promise<Response> {
        const headers = this.headers;

        const init: RequestInit = {
            method: method,
            headers
        }

        if (data) {
            init.body = JSON.stringify(data);
        }

        const response = await fetch(`${Constants.API}/${endpoint}`,init);

        if (response.status >= 300) {
            logs.error(`DiscordRESTerror: ${response.status.toString()} ${response.statusText}`);
        }

        return response;
    }
}