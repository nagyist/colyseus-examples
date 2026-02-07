import { defineServer, defineRoom, monitor, playground, auth, createRouter, LobbyRoom, RelayRoom } from "colyseus";
import path from 'path';
import serveIndex from 'serve-index';
import express from 'express';

// import { uWebSocketsTransport} from "@colyseus/uwebsockets-transport";
import "./config/auth";

// Import demo room handlers
import { ChatRoom } from "./rooms/01-chat-room";
import { StateHandlerRoom } from "./rooms/02-state-handler";
import { AuthRoom } from "./rooms/03-auth";
import { ReconnectionRoom } from './rooms/04-reconnection';
import { CustomLobbyRoom } from './rooms/07-custom-lobby-room';

const __dirname = import.meta.dirname;

export const server = defineServer({
    devMode: true,

    rooms: {
        lobby: defineRoom(LobbyRoom),

        relay: defineRoom(RelayRoom, { maxClients: 4 })
            .enableRealtimeListing(),

        chat_with_options: defineRoom(ChatRoom, { custom_options: "you can use me on Room#onCreate" }),

        chat: defineRoom(ChatRoom)
            .enableRealtimeListing(),

        state_handler: defineRoom(StateHandlerRoom)
            .enableRealtimeListing(),

        auth: defineRoom(AuthRoom)
            .enableRealtimeListing(),

        reconnection: defineRoom(ReconnectionRoom)
            .enableRealtimeListing(),

        custom_lobby: defineRoom(CustomLobbyRoom),
    },

    express: (app) => {
        app.use(express.json());

        // (optional) auth module
        app.use(auth.prefix, auth.routes());

        // (optional) client playground
        app.use('/playground', playground);

        // (optional) web monitoring panel
        app.use('/colyseus', monitor());

        app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}), express.static(path.join(__dirname, "static")));
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
