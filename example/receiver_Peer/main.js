"use strict";
//==================================================================
// DEV USER VARIABLES
// Just a random private key
let devWallet = {
    privateKey: "2582d0e7659f380a60c282f122194fae2acb55b3f69615b3d01c5f066cfaa03f"
};

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
let scanCaptured = false;

// Create an Instance of the Initiator Peer
let mewConnect = new MewConnectClient(signalStateChange, logger, {wrtc: MewRTC, cryptoImpl: new MewConnectCrypto(CCrypto.crypto, CCrypto.secp256k1, EthUtilities, BBuffer.Buffer), io: io, ethUtils: ""});
// var urlBase = "35.160.138.139";
var urlBase = "localhost";


// Separate the connection ID from the confirmation key and send both to the signaling server
function connect(code){
    socketKeyButtonState();
    let options = mewConnect.parseConnectionCodeString(code);
    console.log("main:34", options); //todo remove dev item
    mewConnect.receiverStart(`https://${urlBase}:3001`, options);
}


document.getElementById("startScan").addEventListener("click", event => {
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
            scanCaptured = true;
            if(content != undefined){
                console.log("content", content);
        connect(content);
                scanner.stop();
            }

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