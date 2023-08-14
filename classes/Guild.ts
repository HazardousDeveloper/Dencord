import Role from "./Role.ts";
import Emoji from "./Emoji.ts";

export default class Guild {
    id!: string;
    name!: string;
    icon?: string;
    splash!: string;
    discoverySplash?: string;
    ownerId!: string;
    afkChannelId?: string;
    afkTimeout!: number;
    widgetEnabled?: boolean;
    verificationLevel!: number;
    explicitContentFilter!: number;
    roles!: Array<Role>;
    emojis!: Array<Emoji>;
    features!: Array<string>;
    mfaLevel!: number;
    applicationId?: string;
    systemChannelId?: string;
    systemChannelFlags!: number;
    rulesChannelId?: string;
    maxPresences?: number;
    maxMembers?: number;
    vanityUrlCode?: string;
    description?: string;
    banner?: string;
    premiumTier!: number;
    premiumSubscriptionCount!: number;
    preferredLocale!: string;
    publicUpdatesChannelId?: string;
    maxVideoChannelUsers?: number;
    maxStageVideoChannelUsers?: number;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    nsfwLevel!: number;
    
    constructor(d: any) {
        this.id = d.id;
        this.name = d.name;
        this.icon = d.icon;
        this.splash = d.splash;
        this.discoverySplash = d.discovery_splash;
        this.ownerId = d.owner_id;
        this.afkChannelId = d.afk_channel_id;
        this.afkTimeout = d.afk_timeout;
        this.widgetEnabled = d.widget_enabled;
        this.verificationLevel = d.verification_level;
        this.explicitContentFilter = d.explicit_content_filter;
        this.roles = [];
        this.emojis = [];
        this.features = d.features;

        for (const roleData of d.roles) {
            this.roles.push(new Role(roleData));
        }

        for (const emojiData of d.emojis) {
            this.emojis.push(new Emoji(emojiData));
        }

        this.mfaLevel = d.mfa_level;
        this.applicationId = d.application_id;
        this.systemChannelId = d.system_channel_id;
        this.systemChannelFlags = d.system_channel_flags;
        this.rulesChannelId = d.rules_channel_id;
        this.maxPresences = d.max_presences;
        this.maxMembers = d.max_members;
        this.vanityUrlCode = d.vanity_url_code;
        this.description = d.description;
        this.banner = d.banner;
        this.premiumTier = d.premium_tier;
        this.premiumSubscriptionCount = d.premium_subscription_count;
        this.preferredLocale = d.preferred_locale;
        this.publicUpdatesChannelId = d.public_updates_channel_id;
        this.maxVideoChannelUsers = d.max_video_channel_users;
        this.maxStageVideoChannelUsers = d.max_stage_video_channel_users;
        this.approximateMemberCount = d.approximate_member_count;
        this.approximatePresenceCount = d.approximate_presence_count;
        this.nsfwLevel = d.nsfw_level;
    }
}