import { Room, Client, CloseCode } from "colyseus";

export class ReconnectionRoom extends Room {
    onCreate (options: any) {
    }

    onJoin (client: Client, options: any, auth: any) {
        client.send("status", "Welcome!");
    }

    onDrop(client: Client, code: number) {
        console.log(client.sessionId, "Dropped!");
        this.allowReconnection(client, 10);
    }

    onReconnect(client: Client) {
        console.log(client.sessionId, "Reconnected!");
        client.send("status", "Welcome back!");
    }

    async onLeave (client: Client, code?: number) {
        const consented = code === CloseCode.CONSENTED;
        console.log(client.sessionId, "Left", { consented });
    }

    onDispose () {
    }

}
