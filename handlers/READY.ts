import Client from "../client/Client.ts";
import Payload from "../interfaces/Payload.ts";
import { User } from "../classes/User.ts";

export default function(client: Client, payload: Payload) {
    client.user = new User(payload.d);
    client.emit("ready");
    console.log(client.user);
}