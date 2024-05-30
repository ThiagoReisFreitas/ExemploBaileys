const connectionWA = require("./server.js")

async function start() {
    const sock = await connectionWA();

    sock.ev.on("messages.upsert", async (message) => {
        console.log(JSON.stringify(message, null, 2));
        const event = message.messages[0];
        const name = event.pushName;
        const num = event.key.remoteJid;

        if(event.key.fromMe){
            return;
        }
        await sock.sendMessage(num, {text: `Olá ${name}, o bot esta funcionando` });
    });
}
start();