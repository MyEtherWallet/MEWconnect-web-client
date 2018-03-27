"use strict";
//todo look into refactoring to accept plug-in testing data, and/or testing tools

const fs = require('fs');
const path = require("path");
const signal = require("./signals").signals;
const stages = require("./signals").stages;
try{
    require('dotenv').config();
} catch(e){
    console.error(e);
}


let options = {
    key: fs.readFileSync(path.join(path.resolve("."), "example", "sampleCerts","devCert.key")),
    cert: fs.readFileSync(path.join(path.resolve("."), "example", "sampleCerts","devCert.cert")),
    requestCert: false,
    rejectUnauthorized: false
};


const server = require('https').createServer(options);
const io = require("socket.io")(server, {
    serveClient: false,
    secure: true
});

const port = process.env.PORT || 3001;
let ServerConnection = require("./serverConnection");

let clients = new Map();

server.listen(port, () => {
    logger("Listening on " + port);
});



io.use(listenToConn);
io.use((socket, next) => {

    //todo check for collisions, inform, and update client
    next();
});


io.on(signal.connection, ioConnection);


function ioConnection(socket) {
    try {
        let token = socket.handshake.query;
        let connector = token.stage || false;
        switch (connector) {
            case stages.initiator:
                initiatorIncomming(socket, token);
                break;
            case stages.receiver:
                receiverIncomming(socket, token);
                break;
            default:
                console.error("Invalid Stage");
                break;
        }

        socket.on(signal.signature, data => {
            receiverConfirm(socket, data);
        });

        socket.on(signal.offerSignal, data => {
            try {
                logger("OFFER", data);
                io.to(data.connId).emit(signal.offer, {data: data.data}); // emit #3 offer (listener: receiver peer)
            } catch (e) {
                console.error(e);
            }
        });

        socket.on(signal.answerSignal, data => {
            try {
                logger("answer", data);
                io.to(data.connId).emit(signal.answer, {data: data.data}); // emit #4 answer (listener: initiator peer)
            } catch (e) {
                console.error(e);
            }
        });

        socket.on(signal.rtcConnected, data => {
            try {
                let cleanUpOk = clients.delete(data);
                if (!cleanUpOk) {
                    logger("connection details already clean or error cleaning up closed connection details");
                } else { // not really necessary if clean up was ok
                    logger("connection details removed");
                }
            } catch (e) {
                console.error(e);
            }
        });

        socket.on(signal.disconnect, reason => {
            console.log("disconnect reason", reason);
            socket.disconnect(true);
        });

        socket.on(signal.tryTurn, data => {
            try {
                socket.to(data.connId).emit(signal.attemptingTurn, {data: null}); // emit #4 answer (listener: initiator peer)
                let connItem = locateMatchingConnection(data.connId);
                if (connItem) {
                    connItem.updateTurnStatus();
                    if (connItem.attemptTurn()) {
                        createTurnConnection();
                    } else if (connItem.connectionFailure()) {
                        socket.to(data.connId).emit(signal.connectionFailed);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });

    } catch (e) {
        console.error(e);
    }
}


function createTurnConnection(){
    try{
        console.log("CREATE TURN CONNECTION");
        const accountSid = process.env.TWILIO;
        const authToken = process.env.TWILLO_TOKEN;
        console.log(accountSid, authToken);
        const client = require('twilio')(accountSid, authToken);

        client.tokens
            .create()
            .then((token) => {
                console.log("--------------------");
                console.log(token.username);
                console.log(token);
                console.log("--------------------");
            });
    } catch (e){
        console.error(e);
    }

}



function initiatorIncomming(socket, details) {
    try {
        console.error("CREATING CONNECTION");
        createConnectionEntry(details, socket.id);
        socket.join(details.connId);
    } catch (e) {
        console.error(e);
    }
}

function receiverIncomming(socket, details) {
    try {
        console.error("RECEIVER CONNECTION");
        let connInstance = locateMatchingConnection(details.connId);
        if (connInstance) {
            socket.emit(signal.handshake, {toSign: connInstance.message}) // emit #1 handshake  (listener: receiver peer)
        } else {
            logger(clients);
            console.error("NO CONNECTION DETAILS");
            socket.emit(signal.invalidConnection); // emit InvalidConnection
        }
    } catch (e) {
        console.error(e);
    }
}

function receiverConfirm(socket, details) {
    try {
        console.error("RECEIVER CONFIRM");
        let connInstance = locateMatchingConnection(details.connId);
        logger(details.connId);
        if (connInstance) {
            if (connInstance.verifySig(details.signed)) {
                socket.join(details.connId);
                logger("PAIR CONNECTION VERIFIED");
                let canUpdate = connInstance.updateConnectionEntry(socket.id);
                if (canUpdate) {
                    socket.to(details.connId).emit(signal.confirmation, {connId: connInstance.connId}) // emit #2  confirmation (listener: initiator peer)
                } else {
                    socket.to(details.connId).emit(signal.confirmationFailedBusy); // emit confirmationFailedBusy
                }
            } else {
                console.error("CONNECTION VERIFY FAILED");
                socket.emit(signal.confirmationFailed); // emit confirmationFailed
            }
        } else {
            logger(clients);
            console.error("NO CONNECTION DETAILS");
            socket.emit(signal.invalidConnection); // emit InvalidConnection
        }
    } catch (e) {
        console.error(e);
    }

}


function createConnectionEntry(details, socketId) {
    try {
        details.initiator = socketId;
        let connectionInstance = new ServerConnection(details);
        clients.set(details.connId, connectionInstance);
        logger(clients);
    } catch (e) {
        console.error(e);
    }
}


function locateMatchingConnection(connId) {
    try {
        logger(clients);
        if (clients.has(connId)) {
            console.log("CONNECTION FOUND");
            return clients.get(connId);
        } else {
            console.error("NO MATCHING CONNECTION");
            return false;
        }
    } catch (e) {
        console.error(e);
    }
}

//======= Utility Functions ==============

function bufferToConnId(buf) {
    return buf.toString("hex").slice(32);
}

function keyToConnId(key) {
    return key.slice(32)
}

function logger(tag, content) {
    if (!content) {
        console.log(tag);
    } else {
        console.log(tag, content)
    }
}

function listenToConn(socket, next){
    logger("-------------------- exchange Listener --------------------");
    logger(socket.handshake);
    logger("------------------------------------------------------------");
    next();
}

