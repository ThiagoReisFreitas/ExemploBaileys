const { DisconnectReason, useMultiFileAuthState, BufferJSON } = require("@whiskeysockets/baileys");

const makeWaSocket = require("@whiskeysockets/baileys").default;

async function connection() {
    
    //utiliza arquivos para autentição e armazenamento de credenciais
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWaSocket({
        printQRInTerminal: true,
        auth: state
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
            
            if (shouldReconnect) {
                connection();
            }
        }
    });

    //Salva o estado sempre que algo mudar
    sock.ev.on("creds.update", saveCreds);

    return sock;
};

module.exports = connection;  
