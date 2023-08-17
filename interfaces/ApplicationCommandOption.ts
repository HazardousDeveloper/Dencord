// Interfaces
import ApplicationCommandOptionChoice from "./ApplicationCommandOptionChoice.ts";

export default interface ApplicationCommandOption {
    name: string;
    description: string;
    type: number;
    required?: boolean;
    choices?: Array<ApplicationCommandOptionChoice>;
    options?: Array<ApplicationCommandOption>;
}