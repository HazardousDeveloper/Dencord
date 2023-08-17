// Interfaces
import ApplicationCommandOption from "./ApplicationCommandOption.ts";

export default interface ApplicationCommand {
    name: string;
    type?: number;
    description: string;
    options?: Array<ApplicationCommandOption>;
}