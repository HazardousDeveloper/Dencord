import Client from "../client/Client.ts";
import Payload from "../interfaces/Payload.ts";
import Message from "../classes/Message.ts";

export default async function(client: Client, payload: Payload) {
    const message = await Message.build(client,payload.d);
    client.emit("messageCreate",message);
}