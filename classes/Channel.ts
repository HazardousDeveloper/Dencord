// Classes
import Guild from "./Guild.ts";

export class Channel {
    id!: string;
    type!: number;
    guildId?: string;
    position?: number;
    name?: string;
    topic?: string;
    
    constructor(d: any) {
        this.id = d.id;
        this.type = d.type;
        this.guildId = d.guild_id;
        this.position = d.position;
        this.name = d.name;
        this.topic = d.topic;
    }
    
}

export class TextChannel extends Channel {
    constructor(d: any) {
        super(d);
    }
}

export class VoiceChannel extends Channel {
    constructor(d: any) {
        super(d);
    }
}