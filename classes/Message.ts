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

    constructor(private client: Client) {
        
    }

    public static async build(client: Client,d: any): Promise<Message> {
        const msg: Message = new Message(client);
        msg.id = d.id;
        msg.channelId = d.channel_id;
        if (d.channelId) {
            msg.channel = await msg.client.getChannel(d.channelId);
        }
        msg.author = new User(d.author);
        msg.content = d.content;
        return msg;
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
        return await Message.build(this.client,newMessage);
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