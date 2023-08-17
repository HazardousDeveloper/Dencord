// Classes
import User from "../classes/User.ts";
import Client from "../client/Client.ts";

// Interfaces
import Payload from "../interfaces/Payload.ts";

// Constants
import { Constants, OpCodes, WebSocketCloseCodes } from "../constants/enums.ts";
import * as Payloads from "../constants/payloads.ts";

// Utilities
import * as logs from "../utilities/logging.ts";

export default class Shard {
    private socket!: WebSocket;
    private interval: any;
    public user: User | undefined;

    resumeGatewayUrl!: string;
    sessionId!: string;
    lastSequenceNumber!: number;

    constructor(private client: Client) {
        
    }

    sendHeartbeat() {
        if (this.socket.readyState === 1) {
            this.socket.send(JSON.stringify(Payloads.Heartbeat));
        }
    }

    heartbeat(ms: number) {
        return setInterval(() => {
            this.sendHeartbeat();
        },ms);
    }

    identify() {
        Payloads.Identify.d.token = this.client.token;
        Payloads.Identify.d.intents = this.client.intents;
        return this.socket.send(JSON.stringify(Payloads.Identify));
    }

    disconnect() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.socket.close();
    }

    reconnect() {
        this.disconnect();
        this.connect(this.resumeGatewayUrl);
    }

    connect(gatewayUrl?: string) {
        try {
            this.socket = new WebSocket(gatewayUrl || Constants.GATEWAY);
            this.socket.onerror = console.error;
            this.socket.addEventListener("close",(ev: CloseEvent) => {
                const errorMessage = WebSocketCloseCodes[String(ev.code)][0];
                if (errorMessage) {
                    logs.error(`WebSocket closed : ${String(ev.code)} "${errorMessage}"`);
                }
                if (!ev.code || (WebSocketCloseCodes[String(ev.code)] && WebSocketCloseCodes[String(ev.code)][1] === true)) {
                    this.reconnect();
                }
            });
            this.socket.onmessage = async (message: MessageEvent) => {
                const payload: Payload = JSON.parse(message.data);

                switch (payload.op) {
                    case (OpCodes.HELLO): {
                        logs.log("Got HELLO");
                        this.interval = this.heartbeat(payload.d.heartbeat_interval);
                        if (!gatewayUrl) {
                            await this.identify();
                        }
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
                    case (OpCodes.RECONNECT): {
                        this.reconnect();
                        break;
                    }
                    case (OpCodes.INVALID_SESSION): {
                        if (payload.d === true) {
                            this.reconnect();
                        } else if (payload.d === false && gatewayUrl) {
                            this.disconnect();
                            this.connect();
                        }
                        break;
                    }
                    case (OpCodes.DISPATCH): {
                        if (payload.s) {
                            this.lastSequenceNumber = payload.s;
                        }
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

            if (gatewayUrl) {
                Payloads.Resume.d.token = this.client.token;
                Payloads.Resume.d.session_id = this.sessionId;
                Payloads.Resume.d.seq = this.lastSequenceNumber;

                this.socket.send(JSON.stringify(Payloads.Resume));
            }
        } catch (err) {
            logs.error(err);
            return;
        }
    }
}