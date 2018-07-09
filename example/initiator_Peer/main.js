'use strict'
//= =================================================================
// DEV USER VARIABLES
/// ///////// Set urlBase To Your Signal Server Address //////////////////
// var urlBase = "35.160.138.139";
axios.get('/configValues')
  .then(_response => {
    console.log(_response) // todo remove dev item
    window.configValues = _response.data.initiator
  })
// ----------------------------------------

//= =================================================================
let connectionState = document.getElementById('connState')
let disconnectBtn = document.getElementById('disconnect')
// let checkNumber = document.getElementById("checkNumber");
let connId = document.getElementById('connId')
let begin = document.getElementById('begin')
let yourAddress = document.getElementById('yourAddress')
let signedMessage = document.getElementById('signedMessage')
let qrString = document.getElementById('qrString')

let testRTCBtn = document.getElementById('testRTC')
let getAddressBtn = document.getElementById('getAddress')
let signMessageBtn = document.getElementById('signMessage')

disconnectBtn.disabled = true
begin.disabled = false
let addMsg = 'getAddress'
let signMsg = 'signMessage'

console.log(MewConnect) // todo remove dev item
// Create an Instance of the Initiator Peer
let mewConnect = new MewConnect.Initiator(null, logger, {
  wrtc: SimplePeer,
  // cryptoImpl: new MewConnect.Crypto(CCrypto.crypto, CCrypto.secp256k1, EthUtilities, BBuffer.Buffer),
  io: io,
  ethUtils: ''
})

function initiateSocketConnection () {
  // initiate socket connection with signaling server
  console.log(`${configValues.proto}://${configValues.host}:${configValues.port}`) // todo remove dev item
  if (configValues.port) {
    mewConnect.initiatorStart(`${configValues.proto}://${configValues.host}:${configValues.port}`)
  } else {
    mewConnect.initiatorStart(`${configValues.proto}://${configValues.host}`)
  }
}

// create qrCode and String for transfer to receiver peer to identify the connection endpoints and begin the WebRTC connection process
function codeDisplay (detail) {
  console.log('codeDisplay', detail)
  qrString.textContent = detail
  var qrcode = new QRCode(document.getElementById('qrcode'), {
    text: detail,
    width: 128,
    height: 128,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  })
}

begin.addEventListener('click', initiateSocketConnection)

// send Rtc message to obtain the address
getAddressBtn.addEventListener('click', mewConnect.sendRtcMessageClosure('address', addMsg).bind(event, addMsg))

// send RTC message to sign a message sent as the second argument
// uses a closure here to delay the usage of the webrtc connection object until the webrtc connection object is created
signMessageBtn.addEventListener('click', mewConnect.sendRtcMessageClosure('signMessage', signMsg).bind(event, signMsg))
testRTCBtn.addEventListener('click', mewConnect.testRTC())
// send disconnect the webrtc connection
// uses a closure here to delay the usage of the webrtc connection object until the webrtc connection object is created
disconnectBtn.addEventListener('click', mewConnect.disconnectRTCClosure())

//= ============================= Message Middleware ========================
// These are the functions that handle the responses received from the receiver peer
// They may also be

mewConnect.on('address', (data) => {
  console.log('address data:', data)
  yourAddress.textContent = data.data.address
})
mewConnect.on('signMessage', (data) => {
  try {
    signedMessage.textContent = data.data
  } catch (e) {
    console.error('signMessage RAW data:', data)
  }
})
mewConnect.on('signTx', (data) => {
  console.log('address data:', data)
  try {
    console.log('signTx data:', data.data)
    signedMessage.textContent = data.data
  } catch (e) {
    console.error('signTx RAW data:', data)
  }
})
// mewConnect.use((data, next) => {
//   if (data.type === 'address') {
//     console.log('address data:', data)
//     yourAddress.textContent = data.data.address
//   } else {
//     next()
//   }
// })

// mewConnect.use((data, next) => {
//   if (data.type === 'signMessage') {
//     try {
//       let signed
//       if (typeof data.data === 'string') {
//         console.log('signMessage data.sig:', data.data.sig)
//         signed = JSON.parse(data.data)
//       } else {
//         signed = data.data
//       }
//       // console.log(signed);
//       signedMessage.textContent = data.data
//     } catch (e) {
//       console.error('signMessage RAW data:', data)
//     }
//   } else {
//     next()
//   }
// })
//
// mewConnect.use((data, next) => {
//   if (data.type === 'signTx') {
//     try {
//       let signed
//       if (typeof data.data === 'string') {
//         signed = JSON.parse(data.data)
//       } else {
//         signed = data.data
//       }
//       console.log('signTx data:', data.data)
//       signedMessage.textContent = data.data
//     } catch (e) {
//       console.error('signTx RAW data:', data)
//     }
//   } else {
//     next()
//   }
// })
//
// mewConnect.use((data, next) => {
//   if (data.type === 'text') {
//     try {
//       if (typeof data === 'string') {
//         document.getElementById('connRecd').textContent = data
//       } else {
//         document.getElementById('connRecd').textContent = JSON.stringify(data)
//       }
//     } catch (e) {
//       console.error(e)
//     }
//   } else {
//     next()
//   }
// })

mewConnect.on('checkNumber', function (event) {
  // checkNumber.textContent = event.detail;
  // console.log(event);
})
mewConnect.on('ConnectionId', function (event) {
  connId.textContent = event.detail
  // console.log(event);
})
// document.addEventListener('codeDisplay', codeDisplay)
// document.addEventListener('SocketConnectedEvent', initiateSocketButtonState)
// document.addEventListener('RtcInitiatedEvent', initiateRtcButtonState)
// document.addEventListener('RtcConnectedEvent', rtcConnectButtonState)
// document.addEventListener('RtcDisconnectEvent', disconnectRtcButtonState)
// document.addEventListener('RtcClosedEvent', rtcCloseButtonState)

mewConnect.on('codeDisplay', codeDisplay)
mewConnect.on('SocketConnectedEvent', initiateSocketButtonState)
mewConnect.on('RtcInitiatedEvent', initiateRtcButtonState)
mewConnect.on('RtcConnectedEvent', rtcConnectButtonState)
mewConnect.on('RtcDisconnectEvent', disconnectRtcButtonState)
mewConnect.on('RtcClosedEvent', rtcCloseButtonState)

function initiateSocketButtonState () {
  disconnectBtn.disabled = true
  begin.disabled = true
}

function initiateRtcButtonState () {
  disconnectBtn.disabled = false
  begin.disabled = true
}

function rtcConnectButtonState () {
  connectionState.textContent = 'WebRTC Connected'
}

function rtcCloseButtonState () {
  document.getElementById('connState').textContent = 'Connection Closed'
  // checkNumber.textContent = '';
  disconnectBtn.disabled = true
  begin.disabled = false
}

function disconnectRtcButtonState () {
  // checkNumber.textContent = '';
  disconnectBtn.disabled = true
}

// ========================== Common Functions ========================================

/*
* Emits events on the document for various stages of the process
* Emits the numbers on the initiator side that need to be entered on the
* receiver side to allow the connection.
* ( otherwise they are basically just for display and user feedback purposes)
*/
/* function signalStateChange (event, data) {
  switch (event) {
    case 'RtcDisconnectEvent':
      document.dispatchEvent(new Event('RtcDisconnectEvent'))
      break
    case 'RtcConnectedEvent':
      document.dispatchEvent(new Event('RtcConnectedEvent'))
      break
    case 'RtcClosedEvent':
      document.dispatchEvent(new Event('RtcClosedEvent'))
      break
    case 'RtcInitiatedEvent':
      document.dispatchEvent(new Event('RtcInitiatedEvent'))
      break
    case 'SocketConnectedEvent':
      document.dispatchEvent(new Event('SocketConnectedEvent'))
      break
    case 'confirmationFailedEvent':
      document.dispatchEvent(new Event('confirmationFailedEvent'))
      break
    case 'RtcSignalEvent':
      document.dispatchEvent(new Event('RtcSignalEvent'))
      break
    case 'RtcMessageEvent':
      document.dispatchEvent(new CustomEvent('RtcMessageEvent', {detail: data}))
      break
    case 'checkNumber':
      document.dispatchEvent(new CustomEvent('checkNumber', {detail: data}))
      break
    case 'ConnectionId':
      document.dispatchEvent(new CustomEvent('ConnectionId', {detail: data}))
      break
    case 'signatureCheck':
      document.dispatchEvent(new CustomEvent('signatureCheck', {detail: data}))
      break
    case 'receiverVersion':
      document.getElementById('recVer').textContent = data
      break
    case 'codeDisplay':
      document.dispatchEvent(new CustomEvent('codeDisplay', {detail: data}))
      break
  }
} */

// misc function
function logger (tag, err) {
  if (!err) {
    console.log(tag)
  } else {
    console.log(tag, err)
  }
}
