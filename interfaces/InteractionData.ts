// Interfaces
import ApplicationCommandResponseOption from "./ApplicationCommandReponseOption.ts";

export default interface InteractionData {
    id: string;
    name: string;
    type: number;
    options?: Array<ApplicationCommandResponseOption>;
    guildId?: string;
    targetId?: string;
}