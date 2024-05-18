const connection = require("./server.js");

async function start() {
    const sock = await connection();

    sock.ev.on("messages.upsert", (message) => {
        if(message && message.messages && message.messages.length > 0) {
            console.log(JSON.stringify(message, null, 2));
        }else{
            console.error("mensagem vazia ou evento invalido!!!")
        }
    });
}
start();