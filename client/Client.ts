// Classes
import { EventEmitter } from "https://deno.land/x/eventemitter@1.2.1/mod.ts";
import User from "../classes/User.ts";
import Shard from "../ws/Shard.ts";
import Message from "../classes/Message.ts";
import RESTapi from "../rest/REST.ts";
import { Channel, TextChannel, VoiceChannel } from "../classes/Channel.ts";
import Guild from "../classes/Guild.ts";
import Application from "../classes/Application.ts";
import Interaction from "../classes/Interaction.ts";

// Utilities
import * as logs from "../utilities/logging.ts";

// Interfaces
import ApplicationCommand from "../interfaces/ApplicationCommand.ts";
import ClientOptions from "../interfaces/ClientOptions.ts";

// Constants
import { TextChannelType } from "../constants/enums.ts";

export default class Client extends EventEmitter<{
    ready (): any
    messageCreate (message: Message): any
    interactionCreate (interaction: Interaction): any
}>{
    token!: string;
    intents!: number;
    socket: Shard = new Shard(this);
    user!: User;
    rest!: RESTapi;
    channels: Map<string,Channel | TextChannel | VoiceChannel> = new Map<string,Channel | TextChannel | VoiceChannel>;
    guilds: Map<string,Guild> = new Map<string,Guild>;
    application!: Application;

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

    async getChannel(id?: string) : Promise<Channel |  TextChannel | VoiceChannel | undefined> {
        if (!id) return;
        let channel = this.channels.get(id);

        if (channel !== undefined) {
            return channel;
        }

        const channelDataResponse = await this.rest.request(`channels/${id}`,"GET");
        const channelData = await channelDataResponse.json();

        if (channelData.code) {
            logs.error(channelData);
            return;
        }
    
        if (Object.values(TextChannelType).includes(channelData.type)) {
            channel = new TextChannel(channelData);
        } else {
            channel = new VoiceChannel(channelData);
        }
    
        this.channels.set(id,channel);

        return channel;
    }

    async getGuild(id?: string) : Promise<Guild | undefined> {
        if (!id) return;
        let guild = this.guilds.get(id);

        if (guild !== undefined) {
            return guild;
        }

        const guildDataResponse = await this.rest.request(`guilds/${id}`,"GET");
        const guildData = await guildDataResponse.json();

        if (guildData.code) {
            logs.error(guildData);
            return;
        }
    
        guild = new Guild(guildData);
    
        this.guilds.set(id,guild);

        return guild;
    }

    async bulkEditCommands(commands: Array<ApplicationCommand>) {
        await this.rest.request(`applications/${this.application.id}/commands`,"PUT",commands);
    }

    async connect() {
        logs.log("Connecting to Discord");

        const appDataResponse = await this.rest.request("applications/@me","GET");
        const appData = await appDataResponse.json();

        const botDataResponse = await this.rest.request("gateway/bot","GET");
        const botData = await botDataResponse.json();

        const botUserDataResponse = await this.rest.request("users/@me","GET");
        const botUserData = await botUserDataResponse.json();

        this.user = new User(botUserData);
        this.application = new Application(appData);
        this.socket.connect();
        logs.log("Connected");
    }
}