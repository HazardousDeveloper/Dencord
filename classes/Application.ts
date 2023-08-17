export default class Application {
    id!: string;
    name!: string;
    icon?: string;
    description!: string;
    rpcOrigins?: Array<string>;
    botPublic!: boolean;
    botRequireCodeGrant!: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    guildId?: string;
    flags?: number;
    tags?: Array<string>;

    constructor(d: any) {
        this.id = d.id;
        this.name = d.name;
        this.icon = d.icon;
        this.description = d.description;
        this.rpcOrigins = d.rpc_origins;
        this.botPublic = d.bot_public;
        this.botRequireCodeGrant = d.bot_require_code_grant;
        this.termsOfServiceUrl = d.terms_of_service_url;
        this.privacyPolicyUrl = d.privacy_policy_url;
        this.guildId = d.guild_id;
        this.flags = d.flags;
        this.tags = d.tags;
    }
}