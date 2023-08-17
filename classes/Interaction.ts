// Classes
import Member from "./Member.ts";
import User from "./User.ts";
import Message from "./Message.ts";
import Client from "../client/Client.ts";

// Interfaces
import InteractionData from "../interfaces/InteractionData.ts";
import MessageContent from "../interfaces/MessageContent.ts";

export default class Interaction {
    id!: string;
    applicationId!: string;
    type!: number;
    data?: InteractionData;
    guildId?: string;
    channelId?: string;
    member?: Member;
    user?: User;
    token!: string;
    version!: number;
    message?: Message;

    constructor(public client: Client,d: any) {
        this.id = d.id;
        this.applicationId = d.application_id;
        this.type = d.type;
        this.data = d.data;
        this.guildId = d.guild_id;
        this.channelId = d.channel_id;
        if (d.member) {
            this.member = new Member(d.member);
        }
        if (d.user) {
            this.user = new User(d.user);
        }
        this.token = d.token;
        this.version = d.version;
        if (d.message) {
            this.message = new Message(this.client,d.message);
        }
    }

    async reply(content: string | MessageContent) {
        let messageData: MessageContent = {
            content: "",
            tts: false
        };

        if (typeof(content) == "string") {
            messageData.content = content;
        } else {
            messageData = content;
        }

        const interactionResponse = {
            type: 4,
            data: messageData
        };

        await this.client.rest.request(
            `interactions/${this.id}/${this.token}/callback`,
            "POST",
            interactionResponse
        );
    }

    async acknowledge() {
        const interactionResponse = {
            type: 5
        };

        await this.client.rest.request(
            `interactions/${this.id}/${this.token}/callback`,
            "POST",
            interactionResponse
        );
    }
}