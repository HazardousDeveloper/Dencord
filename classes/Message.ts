import { User } from "../classes/User.ts";
import Client from "../client/Client.ts";
import { Channel, TextChannel, VoiceChannel } from "./Channel.ts";
import { TextChannelType, VoiceChannelType } from "../constants/enums.ts";

export default class Message {
    id!: string;
    channelId?: string;
    channel?: Channel | TextChannel | VoiceChannel;
    author!: User;
    content!: string;

    constructor(private client: Client,d: any) {
        this.id = d.id;
        this.channelId = d.channel_id;
        console.log(this.channelId);
        this.author = new User(d.author);
        this.content = d.content;
        this.client.getChannel(this.channelId).then((value) => {
            this.channel = value;
        });
    }

    async reply(content: string | any) {
        let data: any = {
            content: "",
            tts: false
        }

        if (typeof(content) == "string") {
            data.content = content;
        } else {
            data = content;
        }

        data["message_reference"] = {
            message_id: this.id,
            channel_id: this.channelId,
            fail_if_not_exists: false
        }

        const response = await this.client.rest.request(`channels/${this.channelId}/messages`,"POST",data);

        const newMessage: any = await response.json();
        return new Message(this.client,newMessage);
    }

    async edit(content: string | any) {
        let data: any = {
            content: "",
            tts: false
        }

        if (typeof(content) == "string") {
            data.content = content;
        } else {
            data = content;
        }

        await this.client.rest.request(`channels/${this.channelId}/messages/${this.id}`,"PATCH",data);
    }

    async delete() {
        await this.client.rest.request(`channels/${this.channelId}/messages/${this.id}`,"DELETE");
    }

    async pin() {
        await this.client.rest.request(`channels/${this.channelId}/pins/${this.id}`,"PUT");
    }

    async unpin() {
        await this.client.rest.request(`channels/${this.channelId}/pins/${this.id}`,"DELETE");
    }
}