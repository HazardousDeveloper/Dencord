// Classes
import WelcomeScreenChannel from "./WelcomeScreenChannel.ts";

export default class WelcomeScreen {
    description?: string;
    welcomeChannels!: Array<WelcomeScreenChannel>;

    constructor(d: any) {
        this.description = d.description;

        this.welcomeChannels = [];

        for (const welcomeChannelData of d.welcome_channels) {
            this.welcomeChannels.push(new WelcomeScreenChannel(welcomeChannelData));
        }
    }
}