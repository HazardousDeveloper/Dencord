// Classes
import User from "./User.ts";

export default class Sticker {
    id!: string;
    packId?: string;
    name!: string;
    description?: string;
    tags!: string;
    type!: number;
    formatType!: number;
    available?: boolean;
    guildId?: string;
    user?: User;
    sortValue?: number;

    constructor(d: any) {
        this.id = d.id;
        this.packId = d.pack_id;
        this.name = d.name;
        this.description = d.description;
        this.tags = d.tags;
        this.type = d.type;
        this.formatType = d.format_type;
        this.available = d.available;
        this.guildId = d.guild_id;

        if (d.user) {
            this.user = new User(d.user);
        }

        this.sortValue = d.sortValue;
    }
}