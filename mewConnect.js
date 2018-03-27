"use strict";

var isNode = typeof global !== "undefined" && ({}).toString.call(global) === '[object global]';

/**
 *
 */
class MewConnectCrypto {
    constructor(crypto, secp256k1, ethUtilities, buffer) {
        this.crypto = crypto;
        this.secp256k1 = secp256k1;
        this.ethUtil = ethUtilities;
        this.buffer = buffer;
    }

    /**
     *
     * @param pvtKey
     */
    setPrivate(pvtKey) {
        this.prvt = new this.buffer(pvtKey, "hex");
    }

    /**
     *
     * @returns {*}
     */
    generateMessage() {
        return this.crypto.randomBytes(32).toString("hex");
    }

    /**
     *
     * @returns {{pub, pvt}}
     */
    // Not the Address, but generate them for the connection check
    prepareKey() {
        this.prvt = this.generatePrivate();
        this.pub = this.generatePublic(this.prvt);
        return this.addKey(this.pub, this.prvt);
    };

    /**
     *
     * @returns {*}
     */
    generatePrivate() {
        let privKey;
        do {
            privKey = this.crypto.randomBytes(32)
        } while (!this.secp256k1.privateKeyVerify(privKey));
        return privKey;
    }

    /**
     *
     * @param privKey
     * @returns {*}
     */
    generatePublic(privKey) {
        let pvt = new this.buffer(privKey, "hex");
        this.prvt = pvt;
        return this.secp256k1.publicKeyCreate(pvt);
    }

    /**
     *
     * @param msgToSign
     * @returns {Promise<string>}
     */
    async signMessage(msgToSign) {
        //todo uncomment after dev
        console.log(msgToSign);
        let msg = await this.ethUtil.hashPersonalMessage(this.ethUtil.toBuffer(msgToSign));
        let signed = await this.ethUtil.ecsign(this.buffer.from(msg), new this.buffer(this.prvt, "hex"));
        var combined = await this.buffer.concat([this.buffer.from(signed.r), this.buffer.from(signed.s), this.buffer.from([signed.v])]);
        let combinedHex = combined.toString("hex");
        console.log(msg);
        console.log(combinedHex);
        // let combinedHex = "321"; //todo remove dev item
        return combinedHex;
    }

    /**
     *
     * @param pub
     * @param pvt
     * @returns {{pub: *, pvt: *}}
     */
    addKey(pub, pvt) {
        console.log({pub: pub, pvt: pvt});
        console.log("public as hex", pub.toString("hex"));
        return {pub: pub, pvt: pvt}
    }

    /**
     *
     * @param buf
     * @returns {string}
     */
    bufferToConnId(buf) {
        // return "321"; //todo remove dev item
        return buf.toString("hex").slice(32); //todo uncomment after dev
    }

}


/**
 *
 */
class MewConnectCommon {
    /**
     *
     * @param uiCommunicatorFunc
     * @param loggingFunc
     */
    constructor(uiCommunicatorFunc, loggingFunc) {
        // if null it calls the middleware registered to each specific lifecycle event
        this.uiCommunicatorFunc = uiCommunicatorFunc || this.applyLifeCycleListeners;
        this.logger = loggingFunc || function (arg1, arg2) {
        };
        this.middleware = [];
        this.lifeCycleListeners = [];

        this.jsonDetails = {
            "signals": {
                "attemptingTurn": "attemptingTurn",
                "turnToken": "turnToken",
                "connection": "connection",
                "signature": "signature",
                "offerSignal": "offerSignal",
                "offer": "offer",
                "answerSignal": "answerSignal",
                "answer": "answer",
                "rtcConnected": "rtcConnected",
                "disconnect": "disconnect",
                "handshake": "handshake",
                "confirmation": "confirmation",
                "invalidConnection": "InvalidConnection",
                "confirmationFailedBusy": "confirmationFailedBusy",
                "confirmationFailed": "confirmationFailed"
            },
            "stages": {
                "initiator": "initiator",
                "receiver": "receiver"
            },
            "lifeCycle": {
                "RtcInitiatedEvent": "RtcInitiatedEvent",
                "signatureCheck": "signatureCheck",
                "SocketConnectedEvent": "SocketConnectedEvent",
                "confirmationFailedEvent": "confirmationFailedEvent",
                "codeDisplay": "codeDisplay",
                "checkNumber": "checkNumber",
                "ConnectionId": "ConnectionId",
                "RtcConnectedEvent": "RtcConnectedEvent",
                "RtcClosedEvent": "RtcClosedEvent",
                "RtcDisconnectEvent": "RtcDisconnectEvent"
            },
            "rtc": {},
            "communicationTypes":{
                "address": "address",
                "signMessage":"signMessage",
                "signTx":"signTx"
            },
            "connectionCodeSeparator": "_"
        }
    }

    /**
     *
     * @param uiCommunicationFunc
     */
    setCommunicationFunction(uiCommunicationFunc) {
        this.uiCommunicatorFunc = uiCommunicationFunc;
    }

    /**
     *
     * @param signal
     * @param data
     */
    commDefault(signal, data) {
        console.log("DEFAULT COMMUNICATION FUNCTION");//todo remove dev item
        console.log("CUSTON EVENT", signal);//todo remove dev item
        console.log("DATA: ", data);//todo remove dev item
    }

    /**
     *
     * @param func
     */
    use(func) {
        this.middleware.push(func);
    }

    useDataHandlers(input, fn) {
        var fns = this.middleware.slice(0);
        if (!fns.length) return fn(null);

        function run(i) {
            fns[i](input, function (err) {
                // upon error, short-circuit
                if (err) return fn(err);

                // if no middleware left, summon callback
                if (!fns[i + 1]) return fn(null);

                // go on to next
                run(i + 1);
            });
        }

        run(0);
    }

    applyDatahandlers(data) {
        let next = function (args) {
            return args;
        }; // function that runs after all middleware
        this.useDataHandlers(data, next);
    }

    /**
     *
     * @param signal
     * @param func
     */
    registerLifeCycleListener(signal, func) {
        if (this.lifeCycleListeners[signal]) {
            this.lifeCycleListeners[signal].push(func);
        } else {
            this.lifeCycleListeners[signal] = [];
            this.lifeCycleListeners[signal].push(func);
        }

    }

    useLifeCycleListeners(signal, input, fn) {
        if (this.lifeCycleListeners[signal]) {

            var fns = this.lifeCycleListeners[signal].slice(0);
            if (!fns.length) return fn(null);

            run(0);
        }

        function run(i) {
            fns[i](input, function (err) {
                // upon error, short-circuit
                if (err) return fn(err);

                // if no middleware left, summon callback
                if (!fns[i + 1]) return fn(null);

                // go on to next
                run(i + 1);
            });
        }

    }

    applyLifeCycleListeners(signal, data) {
        let next = function (args) {
            return args;
        }; // function that runs after all middleware
        this.useLifeCycleListeners(signal, data, next);
    }

    /*
    * allows external function to listen for lifecycle events
    */
    uiCommunicator(event, data) {
        return data ? this.uiCommunicatorFunc(event, data) : this.uiCommunicatorFunc(event, null);
    }

    // check necessary plugable functions are present
    functionCheck() {}

}

/**
 * Interface Class used to provide defaults and a standard interface used by both MewConnectReceiver and MewConnectInitiator
 */
class MewConnectPeer extends MewConnectCommon {
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc);

        this.peer = additionalLibs.wrtc;
        window.onunload = window.onbeforeunload = function (e) {
            if (!!this.peer && !this.peer.destroyed) {
                this.rtcDestroy();
            }
        };
    }

// METHODS EXTENDING CLASSES MUST OVERRIDE
    receiveOffer(data) {
        console.error("NOT IMPLEMENTED");
    }

    /*
* begins the rtc connection and creates the offer and rtc confirm code
* */
    initiatorStartRTC(socket, signalListener) {
        console.error("NOT IMPLEMENTED");
    }


    /*
    * Used by the initiator to accept the rtc offer's answer
    */
    rtcRecieveAnswer(data) {
        console.error("NOT IMPLEMENTED");
    }

    rtcSend(arg) {
        console.error("NOT IMPLEMENTED");
    }

    rtcDestroy() {
        console.error("NOT IMPLEMENTED");
    }

    /*
    * creates the confirm number and emits it along with the rtc confirm code to the server
    */
    initiatorSignalListener(socket, options) {
        return function offerEmmiter(data) {
            console.error("NOT IMPLEMENTED");
        }
    }

    onData(data) {
        console.error("NOT IMPLEMENTED");
    }

    onSignal(data) {
        console.error("NOT IMPLEMENTED");
    }

    onConnect() {
        console.error("NOT IMPLEMENTED");
    }

    onClose(data) {
        console.error("NOT IMPLEMENTED");
    }

    onError(err) {
        console.error("NOT IMPLEMENTED");
    }

}

/**
 *
 */
class MewConnectSimplePeer extends MewConnectPeer {
    /**
     *
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     */
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc, additionalLibs);

        this.peer = additionalLibs.wrtc;
        this.stunServers = [
            {url: 'stun:global.stun.twilio.com:3478?transport=udp'}
        ];

        this.turnServers = [];
        this.p = null;
    }

    /**
     *
     * @param data
     */
    receiveOffer(data) {
        this.logger(data);
        let webRtcServers, webRtcConfig;
        webRtcConfig = data.options || {};
        webRtcServers = webRtcConfig.servers || this.stunServers;

        let simpleOptions = {
            initiator: false,
            trickle: false,
            reconnectTimer: 100,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: webRtcServers
            }
        };
        this.p = new this.peer(simpleOptions);

        // this.p = p;
        this.p.signal(JSON.parse(data.data));
        this.p.on('error', this.onError.bind(this));
        this.p.on('connect', this.onConnect.bind(this));
        this.p.on('data', this.onData.bind(this));
        this.p.on('close', this.onClose.bind(this));
        this.p.on('signal', this.onSignal.bind(this));
    }

    /*
* begins the rtc connection and creates the offer and rtc confirm code
* */
    /**
     *
     * @param socket
     * @param options
     */
    initiatorStartRTC(socket, options) {
        let signalListener, webRtcServers, webRtcConfig;
        webRtcConfig = options.webRtcConfig || {};
        signalListener = options.signalListener(socket, webRtcConfig) || this.initiatorSignalListener(socket, webRtcConfig);
        webRtcServers = webRtcConfig.servers || this.stunServers;

        let simpleOptions = {
            initiator: true,
            trickle: false,
            reconnectTimer: 100,
            iceTransportPolicy: 'relay',
            config: {
                iceServers: webRtcServers
            }
        };

        this.uiCommunicator("RtcInitiatedEvent");
        this.p = new this.peer(simpleOptions);
        this.p.on('error', this.onError.bind(this));
        this.p.on('connect', this.onConnect.bind(this));
        this.p.on('close', this.onClose.bind(this));
        this.p.on('data', this.onData.bind(this));
        this.p.on('signal', signalListener.bind(this));
    }

    /*
    * Used by the initiator to accept the rtc offer's answer
    */
    /**
     *
     * @param data
     */
    rtcRecieveAnswer(data) {
        this.p.signal(JSON.parse(data.data));
    }

    /**
     *
     * @param arg
     */
    rtcSend(arg) {
        if (typeof arg === "string") {
            this.p.send(arg);
        } else {
            this.p.send(JSON.stringify(arg));
        }

    }

    /**
     *
     */
    rtcDestroy() {
        this.p.destroy();
    }
}


/**
 *
 */
class MewConnectInitiator extends MewConnectSimplePeer {
    /**
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     */
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc, additionalLibs);
        this.qrCodeString = null;
        if(isNode){
            this.mewCrypto = additionalLibs.cryptoImpl || new MewConnectCrypto(
                ethUtil.crypto,
                require("secp256k1"),
                ethUtil,
                require("buffer").Buffer);
        } else {
            this.mewCrypto = additionalLibs.cryptoImpl || new MewConnectCrypto(
                CCrypto.crypto,
                CCrypto.secp256k1,
                EthUtilities,
                BBuffer.Buffer);
        }


        this.io = additionalLibs.io;
        this.stunServers = [
            {url: 'stun:global.stun.twilio.com:3478?transport=udp'}
        ];
        this.socketConnected = false;
        this.connected = false;

        this.signals = this.jsonDetails.signals;

    }

    /**
     *
     * @returns {boolean}
     */
    getSocketConnectionState() {
        return this.socketConnected;
    }

    /**
     *
     * @returns {boolean}
     */
    getConnectonState() {
        return this.connected;
    }

    /**
     *
     * @param url
     */
    initiatorStart(url) {
        this.keys = this.mewCrypto.prepareKey();
        let toSign = this.mewCrypto.generateMessage();
        this.signed = this.mewCrypto.signMessage(toSign);
        this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
        this.signed.then(response => {
            this.displayCode(this.keys.pvt.toString("hex"));
            this.uiCommunicator("signatureCheck", response);
            let options = {
                query: {
                    peer: "peer1",
                    stage: "initiator",
                    signed: response,
                    message: toSign,
                    connId: this.connId
                },
                transports: ['websocket', 'polling', 'flashsocket'],
                secure: true
            };
            this.socketManager = this.io(url, options);
            this.socket = this.socketManager.connect();
            this.initiatorConnect(this.socket);
        })
    }

    /**
     *
     * @param socket
     * @returns {*}
     */
    initiatorConnect(socket) {
        this.uiCommunicator("SocketConnectedEvent");

        this.socket.on(this.signals.connect, () => {
            this.socketConnected = true;
            this.applyDatahandlers(JSON.stringify({type: "socketConnected", data: null}));
        });
        this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
        this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
        this.socketOn(this.signals.confirmationFailedBusy, () => {
            this.uiCommunicator("confirmationFailedEvent");
            this.logger("confirmation Failed: Busy");
        });
        this.socketOn(this.signals.confirmationFailed, () => {
            this.uiCommunicator("confirmationFailedEvent");
            this.logger("confirmation Failed: invalid confirmation");
        });
        this.socketOn(this.signals.invalidConnection, () => {
            this.uiCommunicator("confirmationFailedEvent"); // should be different error message
            this.logger("confirmation Failed: no opposite peer found");
        });
        this.socketOn(this.signals.disconnect, (reason) => {
            this.logger(reason);
            this.socketConnected = false;
        });

        this.socketOn(this.signals.attemptingTurn, () => {
            console.log("TRY TURN CONNECTION");//todo remove dev item
        });

        this.socketOn(this.signals.turnToken, data => {
            this.retryViaTurn(data);
        });

        return socket;
    }

    /**
     *
     * @param data
     */
    retryViaTurn(data) {
        let options = {
            signalListener: this.initiatorSignalListener,
            webRtcConfig: {
                servers: data.data
            }
        };
        this.initiatorStartRTC(this.socket, options);
    }

    /**
     *
     * @param data
     */
    displayCode(data) {
        this.logger("handshake", data);
        this.socketKey = data;
        let qrCodeString = data + this.jsonDetails.connectionCodeSeparator + this.connId;
        this.qrCodeString = qrCodeString;
        this.applyDatahandlers(JSON.stringify({type: "codeDisplay", data: qrCodeString}));
        this.uiCommunicator("codeDisplay", qrCodeString);
        this.uiCommunicator("checkNumber", data);
        this.uiCommunicator("ConnectionId", this.connId);
    }

    /**
     *
     * @param data
     */
    sendOffer(data) {
        this.logger("sendOffer", data);
        let options = {
            signalListener: this.initiatorSignalListener,
            webRtcConfig: {
                servers: this.stunServers
            }
        };
        this.initiatorStartRTC(this.socket, options);
    }

    /**
     *
     * @param err
     */
    onError(err) {
        console.error("WRTC ERROR");
        this.logger("error", err);
    }

    /**
     *
     */
    onConnect() {
        this.logger("CONNECT", "ok");
        this.connected = true;
        this.rtcSend({type: "text", data: "From Mobile"});
        this.uiCommunicator("RtcConnectedEvent");
        this.applyDatahandlers(JSON.stringify({type: "rtcConnected", data: null}));
        this.socketEmit(this.signals.rtcConnected, this.socketKey);
        this.socketDisconnect();
    }

    /**
     *
     * @param data
     */
    onClose(data) {
        console.error("WRTC CLOSE");
        this.connected = false;
        this.uiCommunicator("RtcClosedEvent", data);
    }

    /**
     *
     * @param data
     */
    onData(data) {
        console.log("DATA RECEIVED", data.toString());
        try {
            if (typeof data === "string") {
                let jData = JSON.parse(data);
                this.applyDatahandlers(jData);
            } else if (typeof data === "object") {
                let incommingData = data.toString();
                this.applyDatahandlers(JSON.parse(incommingData));
            } else {
                this.applyDatahandlers(data);
            }
        } catch (e) {
            console.error(e);
            this.logger("peer2 ERROR: data=", data);
            this.logger("peer2 ERROR: data.toString()=", data.toString())
            // this.applyDatahandlers(data);
        }
    }

    /**
     * creates the confirm number and emits it along with the rtc confirm code to the server
     * @param socket
     * @param options
     * @returns {offerEmmiter}
     */
    initiatorSignalListener(socket, options) {

        return function offerEmmiter(data) {
            let listenerSignal = this.signals.offerSignal;
            this.logger('SIGNAL', JSON.stringify(data));
            let send = JSON.stringify(data);
            this.socketEmit(listenerSignal, {data: send, connId: this.connId, options: options});
        }
    }

    /**
     * sends a hardcoded message through the rtc connection
     * @param msg
     * @returns {any}
     */
    testRTC(msg) {
        return function () {
            this.rtcSend(JSON.stringify({type: 2, text: msg}));
        }.bind(this);
    }

    /**
     * sends a message through the rtc connection. using a closure to hold off calling the rtc object until after it is created
     * @param type
     * @param msg
     * @returns {any}
     */
    sendRtcMessageClosure(type, msg) {
        return function () {
            this.rtcSend(JSON.stringify({type: type, data: msg}));
        }.bind(this);
    }

    /**
     * send an rtc message
     * @param type
     * @param msg
     */
    sendRtcMessage(type, msg) {
        this.rtcSend(JSON.stringify({type: type, data: msg}));
    }

    /**
     * Disconnect the current RTC connection
     * @returns {any}
     */
    disconnectRTCClosure() {
        return function () {
            this.uiCommunicator("RtcDisconnectEvent");
            this.applyDatahandlers(JSON.stringify({type: "rtcDisconnect", data: null}));
            this.rtcDestroy();
            this.instance = null;
        }.bind(this);
    }

    /**
     *
     */
    disconnectRTC() {
        this.uiCommunicator("RtcDisconnectEvent");
        this.applyDatahandlers(JSON.stringify({type: "rtcDisconnect", data: null}));
        this.rtcDestroy();
        this.instance = null;
    }

    /**
     * Used by the initiator to accept the rtc offer's answer
     * @param data
     */
    recieveAnswer(data) {
        this.rtcRecieveAnswer(data);
    }

    /**
     *
     * @param signal
     * @param data
     */
    socketEmit(signal, data) {
        this.socket.emit(signal, data);
    }

    /**
     *
     */
    socketDisconnect() {
        this.socket.disconnect();
    }

    /**
     *
     * @param signal
     * @param func
     */
    socketOn(signal, func) {
        this.socket.on(signal, func);
    }
}


class MewConnect extends MewConnectInitiator {
    /**
     *  extensions to plug callbacks into specific events/occupancies without needing to construct separate checking mechanisms
     *  and expose a factory method.  Primarily for usage in
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     */
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc, additionalLibs);
        this.qrCodeString = null;
        this.addressCallback = null;
        this.signerCallback = null;
        this.messageSignerCallback = null;
        this.transactionSignerCallback = null;
        this.codeDisplayCallback = null;
        this.rtcConnectedCallback = null;
        this.rtcClosedCallback = null;
        this.connected = false;
        this.internalMiddlewareActive = false;
        this.internalLifeCycleActive = false;
    }

    /**
     *
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     * @returns {MewConnect}
     */
    static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);
        return this.instance;
    }

    /**
     *
     * @returns {MewConnect}
     */
    static get() {
        return this.instance;
    }

    /**
     *
     * @returns {boolean}
     */
    isInternalMiddlewareActive() {
        return this.internalMiddlewareActive;
    }

    /**
     *
     * @returns {boolean}
     */
    isInternalLifeCycleActive() {
        return this.internalLifeCycleActive;
    }

    /**
     *
     * @param func
     */
    setAddressCallback(func) {
        this.addressCallback = func;
    }

    /**
     *
     * @param func
     */
    setSignerCallback(func) {
        this.signerCallback = func;
    }

    /**
     *
     * @param func
     */
    setMessageSignerCallback(func) {
        this.messageSignerCallback = func;
    }

    /**
     *
     * @param func
     */
    setTransactionSignerCallback(func) {
        this.transactionSignerCallback = func;
    }

    /**
     *
     * @param uiCommunicationFunc
     */
    setCommunicationFunction(uiCommunicationFunc) {
        this.uiCommunicatorFunc = uiCommunicationFunc;
    }

    /**
     *
     * @param func
     */
    registerCodeDisplayCallback(func) {
        this.registerLifeCycleListener("codeDisplay", func);
    }

    /**
     *
     * @param func
     */
    registerRtcConnectedCallback(func) {
        this.registerLifeCycleListener("RtcConnectedEvent", func);
    }

    /**
     *
     * @param func
     */
    registerRtcClosedCallback(func) {
        this.registerLifeCycleListener("RtcClosedEvent", func);
    }

    /**
     *
     */
    configureInternalLifecycle() {
        if (!this.internalLifeCycleActive) {
            this.internalLifeCycleActive = true;
            this.use((data, next) => {
                if (data) {
                    if (data.type) {
                        switch (data.type) {
                            case "codeDisplay":
                                if (!this.codeDisplayCallback) {
                                    next();
                                } else {
                                    this.codeDisplayCallback(data.data);
                                }
                                break;
                            case "RtcConnectedEvent":
                                this.connected = true;
                                // if (this.instance) this.instance.connected = true;
                                if (!this.rtcConnectedCallback) {
                                    next();
                                } else {
                                    this.rtcConnectedCallback(data.data);
                                }
                                break;
                            // case "rtcDisconnect":
                            // case "RtcDisconnectEvent":
                            case "RtcClosedEvent":
                                if (!this.rtcClosedCallback) {
                                    next();
                                } else {
                                    this.rtcClosedCallback(data.data);
                                }
                                break;
                            default:
                                next();
                                break;
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }


            })
        }
    }

    /**
     *
     */
    configureInternalMiddleware() {
        if (!this.internalMiddlewareActive) {
            this.internalMiddlewareActive = true;
            console.log("mewConnect:721 configureInternalMiddleware",); //todo remove dev item
            this.use((data, next) => {
                if (data) {
                    if (data.type) {
                        switch (data.type) {
                            case "address":
                                if (!this.addressCallback) {
                                    next();
                                } else {
                                    this.addressCallback(data.data);
                                }
                                break;
                            case "sign":
                                if (!this.signerCallback) {
                                    next();
                                } else {
                                    this.signerCallback(data.data);
                                }
                                break;
                            case "signMessage":
                                if (!this.messageSignerCallback) {
                                    next();
                                } else {
                                    this.messageSignerCallback(data.data);
                                }
                                break;
                            case "signTx":
                                if (!this.transactionSignerCallback) {
                                    next();
                                } else {
                                    this.transactionSignerCallback(data.data);
                                }
                                break;
                            default:
                                next();
                                break;
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }


            })
        }
    }


}

// ======================= Receiver ===============================


/**
 *
 */
class MewConnectReceiver extends MewConnectSimplePeer {
    /**
     *
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     */
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc, additionalLibs);

        console.log(this.jsonDetails.connectionCodeSeparator);
        this.mewCrypto = additionalLibs.cryptoImpl;
        this.io = additionalLibs.io;
        this.tryTurn = true;
        this.triedTurn = false;
    }

    parseConnectionCodeString(str){
        try {
            let connParts = str.split(this.jsonDetails.connectionCodeSeparator);
            console.log(connParts);
            return {
                connId: connParts[1].trim(),
                key: connParts[0].trim()
            };
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param url
     * @param params
     * @returns {Promise<void>}
     */
    async receiverStart(url, params) {
        try{
            console.log(params);
            this.mewCrypto.setPrivate(params.key); //todo uncomment after dev
            this.connId = params.connId;
            let options = {
                query: {
                    peer: "peer2",
                    connId: this.connId,
                    stage: "receiver"
                },
                secure: true
            };
            console.log("options", options);
            this.socketManager = this.io(url, options);
            this.socket = this.socketManager.connect();

            this.socketOn('offer', this.receiveOffer.bind(this));
            this.socketOn("handshake", this.socketHandshake.bind(this));
            this.socketOn("InvalidConnection", this.uiCommunicator("InvalidConnection"));
            this.socketOn("turnToken", data => {
                this.retryViaTurn(data);
            });
        } catch(e) {
            console.error(e);
        }
    }

    /**
     *
     * @param data
     */
    retryViaTurn(data){
        console.log("TURN TOKEN RECIEVED");
        // this.receiverTurnRTC(data);
    }

    /**
     *
     * @param data
     * @returns {Promise<void>}
     */
    async socketHandshake(data) {
        // this.signed = "321"; //todo remove dev item
        console.log("socketHandshake", data);
        this.signed = await this.mewCrypto.signMessage(data.toSign); //todo uncomment after dev
        this.uiCommunicator("signatureCheck", this.signed);
        this.socketEmit("signature", {signed: this.signed, connId: this.connId});
    }

    /**
     *
     * @param data
     */
    onData(data) {
        console.log("DATA RECEIVED", data.toString());
        try {
            if(typeof data === "string"){
                let jData = JSON.parse(data);
                console.log("data as JSON:", jData);
                this.applyDatahandlers(jData);
            } else {
                if(data instanceof ArrayBuffer){
                    console.log("mewConnectReceiver:54 typeof data: ", typeof data); //todo remove dev item
                }

                let jData = JSON.parse(data.toString());
                console.log("data as JSON:", jData);
                this.applyDatahandlers(jData);
            }
        } catch (e) {
            console.error(e);

        }
    }

    /**
     *
     * @param data
     */
    onSignal(data) {
        this.logger("signal: ", JSON.stringify(data));
        let send = JSON.stringify(data);
        this.socketEmit('answerSignal', {data: send, connId: this.connId});
        this.uiCommunicator("RtcSignalEvent");
    }

    /**
     *
     */
    onConnect() {
        this.logger("CONNECTED");
        this.rtcSend({type: "text", data: "From Web"});
        this.uiCommunicator("RtcConnectedEvent");
        this.socketEmit("rtcConnected", this.connId);
        this.tryTurn = false;
        this.socketDisconnect();
    }

    /**
     *
     * @param data
     */
    onClose(data) {
        console.error("WRTC CLOSE");
        this.uiCommunicator("RtcClosedEvent");
        if(!this.triedTurn && this.tryTurn){
            this.attemptTurnConnect();
        }
    }

    /**
     *
     * @param err
     */
    onError(err) {
        console.error("WRTC ERROR");
        console.error(err);
    }

    /**
     *
     */
    attemptTurnConnect(){
        this.triedTurn = true;
        console.log("TRY TURN CONNECTION");
        this.socketEmit("tryTurn", {connId: this.connId, cont: true});
    }


    // sends a hardcoded message through the rtc connection
    /**
     *
     * @param msg
     * @returns {any}
     */
    testRTC(msg) {
        return function () {
            this.rtcSend(JSON.stringify({type: 2, text: msg}));
        }.bind(this);
    }

// sends a message through the rtc connection
    /**
     *
     * @param type
     * @param msg
     * @returns {any}
     */
    sendRtcMessage(type, msg) {
        return function () {
            console.log("peer 2 sendRtcMessage", msg);
            this.rtcSend(JSON.stringify({type: type, data: msg}));
        }.bind(this);
    }

    // sends a message through the rtc connection
    /**
     *
     * @param type
     * @param msg
     */
    sendRtcMessageResponse(type, msg) {
        console.log("peer 2 sendRtcMessage", msg);
        this.rtcSend(JSON.stringify({type: type, data: msg}));
    }

    /*
    * Disconnect the current RTC connection
    */
    /**
     *
     * @returns {any}
     */
    disconnectRTC() {
        return function () {
            this.uiCommunicator("RtcDisconnectEvent");
            this.rtcDestroy();
        }.bind(this);
    }

    socketEmit(signal, data){
        this.socket.emit(signal, data);
    }

    socketDisconnect(){
        this.socket.disconnect();
    }

    socketOn(signal, func){
        this.socket.on(signal, func);
    }

}

class MewConnectClient extends MewConnectReceiver {
    /**
     *  extensions to plug callbacks into specific events/occupancies without needing to construct separate checking mechanisms
     *  and expose a factory method.  Primarily for usage in
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     */
    constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        super(uiCommunicatorFunc, loggingFunc, additionalLibs);
        this.qrCodeString = null;
        this.addressCallback = null;
        this.signerCallback = null;
        this.messageSignerCallback = null;
        this.transactionSignerCallback = null;
        this.codeDisplayCallback = null;
        this.rtcConnectedCallback = null;
        this.rtcClosedCallback = null;
        this.connected = false;
        this.internalMiddlewareActive = false;
        this.internalLifeCycleActive = false;
    }

    /**
     *
     * @param uiCommunicatorFunc
     * @param loggingFunc
     * @param additionalLibs
     * @returns {MewConnect}
     */
    static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
        this.instance = new MewConnect(uiCommunicatorFunc, loggingFunc, additionalLibs);
        return this.instance;
    }

    /**
     *
     * @returns {MewConnect}
     */
    static get() {
        return this.instance;
    }

    /**
     *
     * @returns {boolean}
     */
    isInternalMiddlewareActive() {
        return this.internalMiddlewareActive;
    }

    /**
     *
     * @returns {boolean}
     */
    isInternalLifeCycleActive() {
        return this.internalLifeCycleActive;
    }

    /**
     *
     * @param func
     */
    setAddressCallback(func) {
        this.addressCallback = func;
    }

    /**
     *
     * @param func
     */
    setSignerCallback(func) {
        this.signerCallback = func;
    }

    /**
     *
     * @param func
     */
    setMessageSignerCallback(func) {
        this.messageSignerCallback = func;
    }

    /**
     *
     * @param func
     */
    setTransactionSignerCallback(func) {
        this.transactionSignerCallback = func;
    }

    /**
     *
     * @param uiCommunicationFunc
     */
    setCommunicationFunction(uiCommunicationFunc) {
        this.uiCommunicatorFunc = uiCommunicationFunc;
    }

    /**
     *
     * @param func
     */
    registerCodeDisplayCallback(func) {
        this.registerLifeCycleListener("codeDisplay", func);
    }

    /**
     *
     * @param func
     */
    registerRtcConnectedCallback(func) {
        this.registerLifeCycleListener("RtcConnectedEvent", func);
    }

    /**
     *
     * @param func
     */
    registerRtcClosedCallback(func) {
        this.registerLifeCycleListener("RtcClosedEvent", func);
    }

    /**
     *
     */
    configureInternalLifecycle() {
        if (!this.internalLifeCycleActive) {
            this.internalLifeCycleActive = true;
            this.use((data, next) => {
                if (data) {
                    if (data.type) {
                        switch (data.type) {
                            case "codeDisplay":
                                if (!this.codeDisplayCallback) {
                                    next();
                                } else {
                                    this.codeDisplayCallback(data.data);
                                }
                                break;
                            case "RtcConnectedEvent":
                                this.connected = true;
                                // if (this.instance) this.instance.connected = true;
                                if (!this.rtcConnectedCallback) {
                                    next();
                                } else {
                                    this.rtcConnectedCallback(data.data);
                                }
                                break;
                            // case "rtcDisconnect":
                            // case "RtcDisconnectEvent":
                            case "RtcClosedEvent":
                                if (!this.rtcClosedCallback) {
                                    next();
                                } else {
                                    this.rtcClosedCallback(data.data);
                                }
                                break;
                            default:
                                next();
                                break;
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }


            })
        }
    }

    /**
     *
     */
    configureInternalMiddleware() {
        if (!this.internalMiddlewareActive) {
            this.internalMiddlewareActive = true;
            console.log("mewConnect:721 configureInternalMiddleware",); //todo remove dev item
            this.use((data, next) => {
                if (data) {
                    if (data.type) {
                        switch (data.type) {
                            case "address":
                                if (!this.addressCallback) {
                                    next();
                                } else {
                                    this.addressCallback(data.data);
                                }
                                break;
                            case "sign":
                                if (!this.signerCallback) {
                                    next();
                                } else {
                                    this.signerCallback(data.data);
                                }
                                break;
                            case "signMessage":
                                if (!this.messageSignerCallback) {
                                    next();
                                } else {
                                    this.messageSignerCallback(data.data);
                                }
                                break;
                            case "signTx":
                                if (!this.transactionSignerCallback) {
                                    next();
                                } else {
                                    this.transactionSignerCallback(data.data);
                                }
                                break;
                            default:
                                next();
                                break;
                        }
                    } else {
                        next();
                    }
                } else {
                    next();
                }


            })
        }
    }
}

if(isNode){
    module.exports.MewConnectCrypto = MewConnectCrypto;
    module.exports.MewConnect = MewConnect;
}
