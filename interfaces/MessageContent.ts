import { Embed } from "./Embed.ts";
import MessageReference from "./MessageReference.ts";

export default interface MessageContent {
	content?: string;
	embeds?: Array<Embed>;
	message_reference?: MessageReference;
	sticker_ids?: Array<string>;
	tts?: boolean;
}