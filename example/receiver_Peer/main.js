"use strict";
//==================================================================
// DEV USER VARIABLES
// Just a random private key
// ---------------[DO NOT PLACE YOUR PRIVATE KEY HERE] -------------------------------------
let devWallet = {
  privateKey: "5ffe6f5f741bf0e58ad2237f223035183bb2a7201da7d5d89ce9bbcf9d7a7001"
  // ---------------[THIS IS FOR DEMONSTRATION PURPOSES ONLY AND IS VERY VERY INSECURE] ------
  // You can make an address and get a private key to use for Development or Other purposes
  // at https://www.myetherwallet.com .  make a wallet, enter some password, and use the generated
  // Private key ONLY FOR Development, fun, etc. But DO NOT USE THAT KEY OR ADDRESS SERIOUSLY
};


//////////// Set urlBase To Your Signal Server Address //////////////////
// var urlBase = "35.160.138.139";
var urlBase = "localhost";
let serverPort = 3200
//----------------------------------------


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
let mewConnect = new MewConnect.Receiver(signalStateChange, logger, {
  wrtc: SimplePeer,
  // cryptoImpl: new MewConnect.Crypto(CCrypto.crypto, CCrypto.secp256k1, EthUtilities, BBuffer.Buffer),
  io: io,
  ethUtils: ""
});



// Separate the connection ID from the confirmation key and send both to the signaling server
function connect(code) {
  socketKeyButtonState();
  let options = mewConnect.parseConnectionCodeString(code);
  console.log("main:34", options); //todo remove dev item
  mewConnect.receiverStart(`https://${urlBase}:${serverPort}`, options);
}

//
// document.getElementById("startScan").addEventListener("click", event => {
//
//   let scanner = new Instascan.Scanner({video: document.getElementById('preview')});
//   scanner.addListener('scan', function (content) {
//     scanCaptured = true;
//     if (content != undefined) {
//       console.log("content", content);
//       connect(content);
//       scanner.stop();
//     }
//
//   });
//
//
//   Instascan.Camera.getCameras().then(function (cameras) {
//     if (cameras.length > 0) {
//       scanner.start(cameras[1]);
//     } else {
//       alert('no cameras found');
//       console.error('No cameras found.');
//     }
//   }).catch(function (e) {
//     console.error(e);
//   });
// })


socketKeyBtn
  .addEventListener("click", function () {
    socketKeyButtonState();
    let qrString = document.getElementById("socketKey").value;
    connect(qrString);
  });


disconnectBtn
  .addEventListener("click", mewConnect.disconnectRTC());


testRTCBtn
  .addEventListener("click", mewConnect.testRTC());

document.addEventListener("signatureCheck", function (event) {
});
document.addEventListener("RtcDisconnectEvent", disconnectRtcButtonState);
document.addEventListener("RtcConnectedEvent", rtcConnectButtonState);
document.addEventListener("RtcClosedEvent", rtcCloseButtonState);
document.addEventListener("RtcSignalEvent", rtcSignalButtonState);
document.addEventListener("confirmationFailedEvent", confirmedState);


function socketKeyButtonState() {
  disconnectBtn.disabled = true;
  socketKeyBtn.disabled = true;
}

function rtcConnectButtonState(evt) {
  connectionState.textContent = "WebRTC Connected";
  socketKeyBtn.disabled = true;
}

function rtcCloseButtonState() {
  connectionState.textContent = "Connection Closed";
  disconnectBtn.disabled = true;
  socketKeyBtn.disabled = false;
}

function rtcSignalButtonState(evt) {
  disconnectBtn.disabled = false;
  socketKeyBtn.disabled = true;
}

function disconnectRtcButtonState() {
  confirmNumber.value = '';
  disconnectBtn.disabled = true;
}

function confirmedState() {
  connectionState.textContent = "Confirmation Failed";
}


//============================== Message Middleware ========================

let addType = "address";
let msgType = "sign";


mewConnect.use((data, next) => {
  if (data.type === "address") {
    console.log("main:207 data: ", data); //todo remove dev item
    let address = getAddress(devWallet.privateKey);
    mewConnect.sendRtcMessageResponse(data.type, address);
  } else {
    next();
  }
});


mewConnect.use((data, next) => {
  if (data.type === "signTx") {
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
  if (data.type === "signMessage") {
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
function signalStateChange(event, data) {
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
  if (type) {
    if (type === "error") {
      if (!err) {
        console.error(tag);
      } else {
        console.error(tag, err)
      }
    }
  } else {
    if (!err) {
      console.info(tag);
    } else {
      console.info(tag, err)
    }
  }

}