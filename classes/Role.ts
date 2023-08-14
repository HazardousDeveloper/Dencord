export default class Role {
    id!: string;
    name!: string;
    color!: number;
    hoist!: boolean;
    icon?: string;
    unicodeEmoji?: string;
    position!: number;
    permissions!: string;
    managed!: boolean;
    mentionable!: boolean;
    flags!: number;

    constructor(d: any) {
        this.id = d.id;
        this.name = d.name;
        this.color = d.color;
        this.hoist = d.hoist;
        this.icon = d.icon;
        this.unicodeEmoji = d.unicode_emoji;
        this.position = d.position;
        this.permissions = d.permissions;
        this.managed = d.managed;
        this.mentionable = d.mentionable;
        this.flags = d.flags;
    }
}