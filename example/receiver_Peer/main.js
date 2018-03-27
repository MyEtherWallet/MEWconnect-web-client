"use strict";
//==================================================================
// DEV USER VARIABLES

let devWallet = {
  // privateKey: "cc8cdea919c19781a971b4c290d27dec25d503b611abff7b725051e220cab5f6",
  // publicKey: "0xa285efbee9bd70e1f595b880b00e112a9c7d126370e31e297833c76fa77c8fc2d4fe5087be7803e38c81f4e05c78e6c70323586fb77cf57189b544d8756949dd",
  // password: "123456789",
    privateKey:"9b11121e377bfde0375bfc1d6726f156bdceec1ca2e2e6b4ce877777f3a2c1be",
  V3: {
    "version": 3,
    "id": "dd9e92fa-17d6-4449-a7d6-488109deb5b2",
    "address": "a842d06bb63912e6062b6be8d7095e603bc58b9d",
    "Crypto": {
      "ciphertext": "2867d6310ef4146bbf79f5c138be7d8595d270265ee2993dc344555050bcade4",
      "cipherparams": {"iv": "f744630c7fdbf7647a161c55b8e01ff7"},
      "cipher": "aes-128-ctr",
      "kdf": "scrypt",
      "kdfparams": {
        "dklen": 32,
        "salt": "ffbd991f8d317d4a6ec687f7b7f5f4b5c2374a5e8bb197283b1291ef1e1aebf7",
        "n": 8192,
        "r": 8,
        "p": 1
      },
      "mac": "b760ad4cebb72504f207669c3353d671886b6ed177778f0c137891e19aaf8e73"
    }
  }
};

let v2Signed = {
  "address": "0xa842d06bb63912e6062b6be8d7095e603bc58b9d",
  "msg": "signMessage",
  "sig": "0xf1168923b0f014cd5b41b4bbe2039f2f69bd88c4009d38700422749a308ea7057c842e81caf039edc22c8ffd4e4dd36bfdbbc018b1dd8ccf451e6c99be056b001b",
  "version": "3",
  "signer": "MEW"
}
function getDevWallet() {
  return devWallet;
}


//==================================================================
let connectionState = document.getElementById("connState");
let disconnectBtn = document.getElementById("disconnect");
let confirmNumber = document.getElementById("confirmNumber");
let socketKeyBtn = document.getElementById("socketKeyBtn");
let testRTCBtn = document.getElementById("testRTC");

disconnectBtn.disabled = true;
socketKeyBtn.disabled = false;


// Create an Instance of the Initiator Peer
let mewConnect = new MewConnectClient(signalStateChange, logger, {wrtc: MewRTC, cryptoImpl: new MewConnectCrypto(CCrypto.crypto, CCrypto.secp256k1, EthUtilities, BBuffer.Buffer), io: io, ethUtils: ""});
// var urlBase = "35.160.138.139";
var urlBase = "localhost";


// Separate the connection ID from the confirmation key and send both to the signaling server
function connect(code){
    socketKeyButtonState();
    let qrString = code;
    console.log(qrString);
    let connParts = qrString.split("-");
    console.log('connParts', connParts); // todo remove debug item
    let options = {
        connId: connParts[1].trim(),
        key: connParts[0].trim()
    };
    mewConnect.receiverStart(`https://${urlBase}:3001`, options);
}


document.getElementById("startScan").addEventListener("click", event => {
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
        console.log(content);
        connect(content);
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[1]);
        } else {
            alert('no cameras found');
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
})


socketKeyBtn
    .addEventListener("click", function(){
        socketKeyButtonState();
        let qrString = document.getElementById("socketKey").value;
        connect(qrString);
    });



disconnectBtn
  .addEventListener("click", mewConnect.disconnectRTC());



testRTCBtn
  .addEventListener("click", mewConnect.testRTC());

document.addEventListener("signatureCheck", function (event) {
    document.getElementById("signed").textContent = event.detail;
    console.log(event);
});
document.addEventListener("RtcDisconnectEvent", disconnectRtcButtonState);
document.addEventListener("RtcConnectedEvent", rtcConnectButtonState);
document.addEventListener("RtcClosedEvent", rtcCloseButtonState);
document.addEventListener("RtcSignalEvent", rtcSignalButtonState);
document.addEventListener("confirmationFailedEvent", confirmedState);
// document.addEventListener("RtcMessageEvent", function(evt){
//   document.getElementById("RtcMessage").textContent = evt.detail;
// });

function socketKeyButtonState(){
  disconnectBtn.disabled = true;
  socketKeyBtn.disabled = true;
}

function rtcConnectButtonState(evt){
  connectionState.textContent = "WebRTC Connected";
  socketKeyBtn.disabled = true;
}

function rtcCloseButtonState(){
  connectionState.textContent = "Connection Closed";
  // document.getElementById("connId").value = '';
  // confirmNumber.value = '';
  disconnectBtn.disabled = true;
  socketKeyBtn.disabled = false;
}

function rtcSignalButtonState(evt){
  disconnectBtn.disabled = false;
  socketKeyBtn.disabled = true;
}

function disconnectRtcButtonState(){
  document.getElementById("connId").value = '';
  confirmNumber.value = '';
  disconnectBtn.disabled = true;
}

function confirmedState(){
  connectionState.textContent = "Confirmation Failed";
}


//============================== Message Middleware ========================

let addType = "address";
let msgType = "sign";


mewConnect.use((data, next) => {
  if(data.type === "address"){
console.log("main:207 data: ", data); //todo remove dev item
    let address = getAddress(devWallet.privateKey);
        mewConnect.sendRtcMessageResponse(data.type, address);
  } else {
    next();
  }
});


mewConnect.use((data, next) => {
  if(data.type === "signTx"){
      console.log("main:218 data: ", data); //todo remove dev item
      signTransaction(data.data, devWallet.privateKey)
      .then(signedmessage => {
        mewConnect.sendRtcMessageResponse(data.type, signedmessage);
      })
      .catch(err => {
        console.error(err);
      })
  } else {
    next();
  }
});

mewConnect.use((data, next) => {
    if(data.type === "signMessage"){
        console.log("main:218 data: ", data); //todo remove dev item
        signMessage(data.data, devWallet.privateKey)
            .then(signedmessage => {
                mewConnect.sendRtcMessageResponse(data.type, signedmessage);
            })
            .catch(err => {
                console.error(err);
            })
    } else {
        next();
    }
});




// ========================== Common Functions ========================================

/*
* Emits events on the document for various stages of the process
* Emits the numbers on the initiator side that need to be entered on the
* receiver side to allow the connection.
* ( otherwise they are basically just for display and user feedback purposes)
*/
function signalStateChange(event, data){
    switch (event) {
        case "RtcDisconnectEvent":
            document.dispatchEvent(new Event("RtcDisconnectEvent"));
            break;
        case "RtcConnectedEvent":
            document.dispatchEvent(new Event("RtcConnectedEvent"));
            break;
        case "RtcClosedEvent":
            document.dispatchEvent(new Event("RtcClosedEvent"));
            break;
        case "RtcInitiatedEvent":
            document.dispatchEvent(new Event("RtcInitiatedEvent"));
            break;
        case "SocketConnectedEvent":
            document.dispatchEvent(new Event("SocketConnectedEvent"));
            break;
        case "confirmationFailedEvent":
            document.dispatchEvent(new Event("confirmationFailedEvent"));
            break;
        case "RtcSignalEvent":
            document.dispatchEvent(new Event("RtcSignalEvent"));
            break;
        case "RtcMessageEvent":
            document.dispatchEvent(new CustomEvent("RtcMessageEvent", {detail: data}));
            break;
        case "checkNumber":
            document.dispatchEvent(new CustomEvent("checkNumber", {detail: data}));
            break;
        case "ConnectionId":
            document.dispatchEvent(new CustomEvent("ConnectionId", {detail: data}));
            break;
        case "signatureCheck":
            document.dispatchEvent(new CustomEvent("signatureCheck", {detail: data}));
            break;
        case "InvalidConnection":
            document.dispatchEvent(new Event("RtcClosedEvent"));
            break;
    }
}

// misc function
function logger(tag, err, type) {
  if(type){
    if(type === "error"){
      if(!err){
        console.error(tag);
      } else {
        console.error(tag, err)
      }
    }
  } else {
    if(!err){
      console.info(tag);
    } else {
      console.info(tag, err)
    }
  }

}