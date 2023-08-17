export interface Embed {
	title?: string;
	type?: string;
	description?: string;
	url?: string;
	timestamp?: number;
	color?: number;
	footer?: EmbedFooter,
	image?: EmbedAttachment,
	thumbnail?: EmbedAttachment,
	video?: EmbedAttachment,
	provider?: EmbedProvider,
	author?: EmbedAuthor,
	fields?: Array<EmbedField>
}

export interface EmbedFooter {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface EmbedAttachment {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export interface EmbedProvider {
	name?: string;
	url?: string;
}

export interface EmbedAuthor {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export interface EmbedField {
	name: string;
	value: string;
	inline?: boolean;
}