// Classes
import User from "./User.ts";

export default class Member {
    user?: User;
    nickname?: string;
    avatar?: string;
    roles!: Array<string>;
    joinedAt!: string;
    premiumSince?: string;
    deaf!: boolean;
    mute!: boolean;
    flags!: number;
    pending?: boolean;
    permissions?: string;
    communicationDisabledUntil?: string;

    constructor(d: any) {
        if (d.user) {
            this.user = new User(d.user);
        }

        this.nickname = d.nick;
        this.avatar = d.avatar;
        this.roles = d.roles;
        this.joinedAt = d.joined_at;
        this.premiumSince = d.premium_since;
        this.deaf = d.deaf;
        this.mute = d.mute;
        this.flags = d.flags;
        this.pending = d.pending;
        this.permissions = d.permissions;
        this.communicationDisabledUntil = d.communication_disabled_until;
    }
}