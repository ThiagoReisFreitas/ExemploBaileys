const { DisconnectReason, useMultiFileAuthState, BufferJSON, makeInMemoryStore, default: makeWaSocket, Browsers } = require("@whiskeysockets/baileys");

const MAX_RECONNECT = 3;
let reconnectAttempts = 0;
async function connectionWA() {

    //utiliza arquivos para autentição e armazenamento de credenciais
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWaSocket({
        version: [2, 2413, 1],
        auth: state,
        printQRInTerminal: true,
        syncFullHistory: false,
        defaultQueryTimeoutMs: undefined,
    });


    //Lida com conecções e desconecções
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(qr);
        }
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect && reconnectAttempts < MAX_RECONNECT) {
                reconnectAttempts++;
                console.log("Tentativa "+reconnectAttempts);
                await reconnect()
            }
        }
        else if(connection === "open") {
            reconnectAttempts = 0;
        }
    });

    //Salva o estado sempre que algo mudar
    sock.ev.on("creds.update", saveCreds);

    return sock;
};

async function reconnect() {
    console.log("tentando reconectar...");
    await connectionWA();
}

module.exports = connectionWA;  
