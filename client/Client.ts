import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";

import { User } from "../classes/User.ts";
import WebsocketManager from "../ws/WebsocketManager.ts";
import Message from "../classes/Message.ts";
import RESTapi from "../rest/REST.ts";
import { Channel, TextChannel, VoiceChannel } from "../classes/Channel.ts";
import { TextChannelType } from "../constants/enums.ts";
import * as logs from "../utilities/logging.ts";
import ClientOptions from "../interfaces/ClientOptions.ts";

export default class Client extends EventEmitter<{
    ready (): any
    messageCreate (message: Message): any
}>{
    token!: string;
    intents!: number;
    private socket: WebsocketManager = new WebsocketManager(this);
    public user!: User;
    public rest!: RESTapi;
    public channels: Map<string,Channel | TextChannel | VoiceChannel> = new Map<string,Channel | TextChannel | VoiceChannel>;

    constructor(token: string,options: ClientOptions) {
        super();
        this.token = token;
        this.rest = new RESTapi(this,{
            "Content-Type": "application/json",
            "Authorization": `Bot ${this.token}`
        });
        if (typeof(options.intents) === "number") {
            this.intents = options.intents;
        } else {
            this.intents = options.intents.reduce((a,b) => a + b,1);
        }
    }

    getChannel(id: string) : Promise<Channel |  TextChannel | VoiceChannel | undefined> {
        return new Promise((resolve,reject) => {
            let channel = this.channels.get(id);

            if (channel) return resolve(channel);

            this.rest.request(`channels/${id}`,"GET").then((channelDataResponse) => {
                channelDataResponse.json().then((channelData) => {
                    if (channelData.code) {
                        logs.error(channelData);
                        reject(channelData);
                    }
            
                    if (Object.values(TextChannelType).includes(channelData.type)) {
                        channel = new TextChannel(channelData);
                    } else {
                        channel = new VoiceChannel(channelData);
                    }
            
                    this.channels.set(id,channel);

                    return resolve(channel);
                })
            });
        });
    }

    connect() {
        this.socket.connect(this.token);
    }
}