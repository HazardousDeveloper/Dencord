import { Constants, OpCodes } from "../constants/enums.ts";
import Payload from "../interfaces/Payload.ts";
import * as Payloads from "../constants/payloads.ts";
import * as logs from "../utilities/logging.ts";
import { User } from "../classes/User.ts";
import Client from "../client/Client.ts";

export default class WebsocketManager {
    private socket!: WebSocket;
    private interval: any;
    public user: User | undefined;

    constructor(private client: Client) {
        
    }

    sendHeartbeat() {
        if (this.socket.readyState === 1) {
            logs.log("Succesfully sent a heartbeat");
            this.socket.send(JSON.stringify(Payloads.Heartbeat));
        }
    }

    heartbeat(ms: number) {
        logs.log("Heartbeating")
        return setInterval(() => {
            logs.log("Sending heartbeat");
            this.sendHeartbeat();
        },ms);
    }

    async identify(token: string) {
        Payloads.Identify.d.token = token;
        Payloads.Identify.d.intents = this.client.intents;
        return this.socket.send(JSON.stringify(Payloads.Identify));
    }

    connect(token: string) {
        try {
            this.socket = new WebSocket(Constants.GATEWAY);
            this.socket.onerror = console.error
            this.socket.addEventListener("open",(_ev: Event) => {
                logs.log("Websocket connection is opened");
            });
            this.socket.onmessage = async (message: MessageEvent) => {
                const payload: Payload = JSON.parse(message.data);

                switch (payload.op) {
                    case OpCodes.HELLO: {
                        logs.log("Got HELLO");
                        this.interval = this.heartbeat(payload.d.heartbeat_interval);
                        await this.identify(token);
                        break;
                    }
                    case (OpCodes.HEARTBEAT): {
                        this.sendHeartbeat();
                        break;
                    }
                    case (OpCodes.HEARTBEAT_ACK): {
                        logs.log("Heartbeat acknowledged");
                        break;
                    }
                    default:
                        break;
                }

                if (payload.t) {
                    const fileName = `../handlers/${payload.t}.ts`
                    try {
                        const { default: module } = await import(fileName);
                        module(this.client,payload);
                    } catch {
                        return;
                    }
                }
            };
        } catch (err) {
            logs.error(err);
            return;
        }
    }
}