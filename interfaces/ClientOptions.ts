import { Intents } from "../constants/enums.ts";

export default interface ClientOptions {
    intents: Array<Intents> | number;
}