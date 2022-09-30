MEWconnect Client for MEW wallet
==========


With the MEWconnect client, users can use your DApp in any desktop browser without
installing an extension.  Additionally, end-to-end encryption using client-side generated
keys keeps all user activity private.

For DApp developers to integrate with MEW wallet using MEWconnect, all you need to do is drop a
few lines of code into your application, and the MEW wallet app and MEWconnect client will take care of the
rest.

## Getting Started

### Installation

```shell
# With NPM
npm install @myetherwallet/mewconnect-web-client
```

### Initializing MEWconnect and a Web3 instance using the default node

```javascript
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3 from "web3"

const CHAIN_ID = 1

// Initialize 
export const mewConnect = new MEWconnect.Provider()

// Initialize a Web3 Provider object
export const ethereum = mewConnect.makeWeb3Provider(CHAIN_ID)

// Initialize a Web3 object
export const web3 = new Web3(ethereum)

```

#### Alternatively, a node rpc url may be supplied 

- Note: only websocket urls are supported.
```javascript
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3 from "web3"

const ETH_JSONRPC_URL = "wss://mainnet.infura.io/v3/<YOUR_INFURA_API_KEY>"
const CHAIN_ID = 1

// Initialize MEWconnect
export const mewConnect = new MEWconnect.Provider()

// Initialize a Web3 Provider object
export const ethereum = mewConnect.makeWeb3Provider(CHAIN_ID, ETH_JSONRPC_URL)

// Initialize a Web3 object
export const web3 = new Web3(ethereum)

```

### Use EIP-1102 to obtain authorization and get Ethereum accounts

Invoking EIP-1102 will show a QR code dialog if the user's mobile wallet is not
already connected to their browser. The following code should run in response to
a user-initiated action such as clicking a button to ensure the pop up is not
blocked by the browser.

```javascript
// Use eth_RequestAccounts
ethereum.send("eth_requestAccounts").then((accounts) => {
  console.log(`User's address is ${accounts[0]}`)

})

// Alternatively, you can use ethereum.enable()
ethereum.enable().then((accounts) => {
  console.log(`User's address is ${accounts[0]}`)
})
```

That's it! Once the connection between the phone and the site is established, the Web3 object
(`web3`) and the Web3 Provider (`ethereum`) are ready to be used as usual.

## MEWconnect.Provider 

### Options
The MEWconnect.Provider can take an options object with the following fields:

 - windowClosedError (default ```false```) Indicates whether the provider should throw an error when the popup window is closed by the user. 

### Events
```javascript
const mewConnect = new MEWconnect.Provider()
mewConnect.on('[event]')
```
 - popupWindowClosed
  
    Emitted when the popup window is closed by the user
    
- disconnected

    Emitted when the user becomes disconnected (Both by disconnecting and if the connection is broken) 

---
## Example
An example may be found in the example directory

---

## Tokens
In order to have your token included in the list of tokens identified by the app the token needs to be included as a token in the [ethereum-lists](https://github.com/MyEtherWallet/ethereum-lists) repository.

Instructions one how to add a token there may be found [here](https://kb.myetherwallet.com/en/tokens/adding-token-as-a-default/)

## Debugging

The MEWconnect client uses the debug library to provide verbose debug logging.  In local storage add the key 'debug' with the value:
  - \* 
    - to see everything
  - MEWconnect: *
    -  to see everything related to the MEWconnect client
  - MEWconnect:connection-state
    - to see the connection state when it changes
  - MEWconnect:webRTC-communication
    - to see the events and signals related to webRTC
  - MEWconnect:websocketWrapper
    - to see the events related to setting up the webRTC connection
  - MEWconnect:*,MEWconnectVerbose:*,simple-peer
    - what we usually use for debugging
    

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

----






















### Using only the wallet with an external web3 instance (not recommended)

Install the client
```npm i @myetherwallet/mewconnect-web-client```




### Get the code
The example requires both MEWconnect-web-client (this repo) and MEWconnect-Signal-Server (MEWconnect-hanshake-server)

```
git clone https://github.com/MyEtherWallet/MEWconnect-web-client.git
```
Install the dependencies:

```
npm install
```

Start the server serving the example initiator and receiver:
```
npm start
```

###### Get the signaling server
Clone the repo:

```
git clone https://github.com/MyEtherWallet/MEWconnect-hanshake-server.git
```
Install the dependencies:

```
npm install
```

Start the signaling server:
```
npm start
```

### Usage
Two Peers are needed with one designated as the Initiator and the other as the Receiver.

Require the MEWconnect client
```javascript
let mewConnect = require('@myetherwallet/mewconnect-web-client').Client;
```

Initiate the client
```javascript
let mewConnectClient = mewConnect.init();
```

MEWconnect Client functions as an event emitter.
The connection details are passed along with the 'codeDisplay' event
```javascript
mewConnectClient.on('codeDisplay', code => {
// do something with the code.
// to work with the MEWconnect Mobile applications display it as a qrcode
}
```


Now call the initiatorStart method to create the connection details:
```javascript
mewConnectClient.initiatorStart('https://signal-server-url')
```

Once a p2p connection is established the client will emit a 'rtcConnected' event
```javascript
mewConnectClient.on('rtcConnected', () =>{
    alert('congrats you are connected to mew connect!')
})
```

Once a connection is extablished call the 'sendRtcMessage' method to interact with the app
```javascript
mewConnectClient.sendRtcMessage('address', {})
```

The 'sendRtcMessage' method takes two parameters (message type, message data)

To get the response listen for an event matching the sent message type
```javascript
mewConnectClient.on('address', address => {
    alert('got address: ' + address)
})
```

Currently the app supports two other message types: 'signMessage', and 'signTx'

exists you can get the address or send a transaction or message to the mobile app for signing.

The data portion of those two message types are:

**signMessage**
```json
{
    hash: 'hash of the message to be signed',
    text: 'text of the message to be signed'
}
```

**signTx**
```json
{
        nonce:"0x00",
        gasPrice:"0x098bca5a00",
        gas:"0x5208",
        to:"0xc3982F1DbAB6DA9d95F579B9A5f9c5CAb13F8cfC",
        value:"0xb1a2bc2ec50000",
        data:"",
        chainId:3

}
```

If the p2p connection fails to be established the client can attempt to use an intermediate TURN server to facilitate the connection.
To signal a failed p2p attempt the client can call the 'useFallback' method on the client
```javascript
mewConnectClient.useFallback()
```

Additional events are emitted at various points to signal various stages of the connection

**SocketConnectedEvent**
- successfully connected to the signal server

**RtcInitiatedEvent**
- Peer identified via the signal server, and a p2p connection will be attempted

**UsingFallback**
- One of the peers failed to establish a p2p connection and will attempt to use an intermediate TURN server to facilitate the connection

**RtcConnectedEvent**
- p2p connection established

**RtcClosedEvent**
- p2p connection closed

**RtcDisconnectEvent**
- p2p disconnected

**RtcErrorEvent**
- p2p connection error occured






---
##### Browser
mew-connect-client can be included for use in the browser via webpack or browerfy
