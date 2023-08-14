import { Constants, OpCodes, WebSocketCloseCodes } from "../constants/enums.ts";
import Payload from "../interfaces/Payload.ts";
import * as Payloads from "../constants/payloads.ts";
import * as logs from "../utilities/logging.ts";
import { User } from "../classes/User.ts";
import Client from "../client/Client.ts";

export default class WebsocketManager {
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

    disconnect() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.socket.close();
    }

    reconnect(token: string) {
        this.disconnect();
        this.connect(token,this.resumeGatewayUrl);
    }

    connect(token: string,gatewayUrl?: string) {
        try {
            this.socket = new WebSocket(gatewayUrl || Constants.GATEWAY);
            this.socket.onerror = console.error;
            this.socket.addEventListener("close",(ev: CloseEvent) => {
                const errorMessage = WebSocketCloseCodes[String(ev.code)][0];
                if (errorMessage) {
                    logs.error(`WebSocket closed : ${String(ev.code)} "${errorMessage}"`);
                }
                if (!ev.code || (WebSocketCloseCodes[String(ev.code)] && WebSocketCloseCodes[String(ev.code)][1] === true)) {
                    this.reconnect(this.client.token);
                }
            });
            this.socket.addEventListener("open",(_ev: Event) => {
                logs.log("Websocket connection is opened");
            });
            this.socket.onmessage = async (message: MessageEvent) => {
                const payload: Payload = JSON.parse(message.data);

                switch (payload.op) {
                    case (OpCodes.HELLO): {
                        logs.log("Got HELLO");
                        this.interval = this.heartbeat(payload.d.heartbeat_interval);
                        if (!gatewayUrl) {
                            await this.identify(token);
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
                        this.reconnect(token);
                        break;
                    }
                    case (OpCodes.INVALID_SESSION): {
                        if (payload.d === true) {
                            this.reconnect(token);
                        } else if (payload.d === false && gatewayUrl) {
                            this.disconnect();
                            this.connect(token);
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