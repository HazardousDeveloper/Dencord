import Client from "../client/Client.ts";
import Payload from "../interfaces/Payload.ts";
import Interaction from "../classes/Interaction.ts";

export default async function(client: Client, payload: Payload) {
    const interaction = await new Interaction(client,payload.d);
    client.emit("interactionCreate",interaction);
}