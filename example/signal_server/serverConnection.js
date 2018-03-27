class ServerConnection {
    constructor(details) {
        try {
            console.log("ServerConnection", details);
            this.connId = details.connId;
            this.message = details.message;
            this.initialSigned = details.signed;
            this.pub = details.pub;
            this.initiator = details.initiator;
            this.receiver = details.receiver || undefined;
            this.requireTurn = false;
            this.tryTurnSignalCount = 0;
        } catch (e) {
            console.error(e);
        }
    }


    updateConnectionEntry(socketId) {
        try {
            console.log("updateConnectionEntry");
            // ensure only one connection pair exists.  Cause any additional/further attempts to fail.
            if (this.receiver) {
                return false;
            } else {
                // update connection entry with socket id of receiver connection
                this.receiver = socketId;
                // clients.set(connEntry.connId, connEntry);
                return true;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    updateTurnStatus(){
        this.tryTurnSignalCount = this.tryTurnSignalCount + 1;
        this.requireTurn = true;
    }

    attemptTurn(){
        return !this.requireTurn;
    }

    connectionFailure(){
        return this.tryTurnSignalCount <= 2;
    }

    verifySig(receiver) {
        return this.initialSigned === receiver;
    };

}


var isNode = typeof global !== "undefined" && ({}).toString.call(global) === '[object global]';

if (isNode) {
    module.exports = ServerConnection;
}