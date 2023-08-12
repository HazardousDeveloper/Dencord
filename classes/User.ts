export class User {

    username: string;
    id: string;
    mfaEnabled: boolean;
    globalName: string | null;
    displayName: string | null;
    discriminator: string | null;
    bot: boolean;
    avatar: string | null;

    constructor(data: any) {
        this.username = data.username;
        this.id = data.id;
        this.mfaEnabled = data.mfaEnabled;
        this.globalName = data.globalName;
        this.displayName = data.displayName;
        this.discriminator = data.discriminator;
        this.bot = data.bot || false;
        this.avatar = data.avatar;
    }
}