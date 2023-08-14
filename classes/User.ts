export class User {

    username: string;
    id: string;
    mfaEnabled: boolean;
    globalName?: string;
    displayName?: string;
    discriminator?: string;
    bot?: boolean;
    avatar?: string;

    constructor(data: any) {
        this.username = data.username;
        this.id = data.id;
        this.mfaEnabled = data.mfaEnabled;
        this.globalName = data.globalName;
        this.displayName = data.displayName;
        this.discriminator = data.discriminator;
        this.bot = data.bot;
        this.avatar = data.avatar;
    }
}