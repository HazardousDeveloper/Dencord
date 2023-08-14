export default class WelcomeScreenChannel {
    channelId!: string;
    description!: string;
    emojiId?: string;
    emojiName?: string;

    constructor(d: any) {
        this.channelId = d.channel_id;
        this.description = d.description;
        this.emojiId = d.emoji_id;
        this.emojiName = d.emoji_name;
    }
}