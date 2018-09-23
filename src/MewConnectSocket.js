const io = require('socket.io-client');

export default class MewConnectSocket {
  constructor(userSuppliedIO) {
    this.io = userSuppliedIO || io;
  }

  async initiatorStart(url) {
    this.keys = this.mewCrypto.prepareKey();
    const toSign = this.mewCrypto.generateMessage();
    this.signed = await this.mewCrypto.signMessage(
      this.keys.pvt.toString('hex')
    );
    this.connId = this.mewCrypto.bufferToConnId(this.keys.pub);
    this.displayCode(this.keys.pvt.toString('hex'));
    this.uiCommunicator(this.lifeCycle.signatureCheck, this.signed);
    const options = {
      query: {
        stage: 'initiator',
        signed: this.signed,
        message: toSign,
        connId: this.connId
      },
      transports: ['websocket', 'polling', 'flashsocket'],
      secure: true
    };
    this.socketManager = this.io(url, options);
    this.socket = this.socketManager.connect();
    this.initiatorConnect(this.socket);
    // this.signed.then(response => {
    //
    // })
  }

  /**
   * Setup message handlers for communication with the signal server
   */
  initiatorConnect(socket) {
    this.logger('INITIATOR CONNECT'); // todo remove dev item
    this.uiCommunicator(this.lifeCycle.SocketConnectedEvent);

    this.socket.on(this.signals.connect, () => {
      this.logger('SOCKET CONNECTED'); // todo remove dev item
      this.socketConnected = true;
      this.applyDatahandlers(
        JSON.stringify({ type: 'socketConnected', data: null })
      );
    });
    // A connection pair exists, create and send WebRTC OFFER
    this.socketOn(this.signals.confirmation, this.sendOffer.bind(this)); // response
    // Handle the WebRTC ANSWER from the opposite (mobile) peer
    this.socketOn(this.signals.answer, this.recieveAnswer.bind(this));
    // Handle Failure due to an attempt to join a connection with two existing endpoints
    this.socketOn(this.signals.confirmationFailedBusy, () => {
      this.uiCommunicator(this.lifeCycle.confirmationFailedBusyEvent);
      this.logger('confirmation Failed: Busy');
    });
    // Handle Failure due to the handshake/ verify details being invalid for the connection ID
    this.socketOn(this.signals.confirmationFailed, () => {
      this.uiCommunicator(this.lifeCycle.confirmationFailedEvent);
      this.logger('confirmation Failed: invalid confirmation');
    });
    // Handle Failure due to no opposing peer existing
    this.socketOn(this.signals.invalidConnection, () => {
      this.uiCommunicator(this.lifeCycle.invalidConnectionEvent); // should be different error message
      this.logger('confirmation Failed: no opposite peer found');
    });
    // Handle Socket Disconnect Event
    this.socketOn(this.signals.disconnect, reason => {
      this.logger(reason);
      this.socketConnected = false;
    });
    // Provide Notice that initial WebRTC connection failed and the fallback method will be used
    this.socketOn(this.signals.attemptingTurn, () => {
      this.logger('TRY TURN CONNECTION'); // todo remove dev item
    });
    // Handle Receipt of TURN server details, and begin a WebRTC connection attempt using TURN
    this.socketOn(this.signals.turnToken, data => {
      this.retryViaTurn(data);
    });

    return socket;
  }

  // Wrapper around socket.emit method
  socketEmit(signal, data) {
    this.socket.binary(false).emit(signal, data);
  }

  // Wrapper around socket.disconnect method
  socketDisconnect() {
    this.socket.disconnect();
  }

  // Wrapper around socket.on listener registration method
  socketOn(signal, func) {
    this.socket.on(signal, func);
  }
}
