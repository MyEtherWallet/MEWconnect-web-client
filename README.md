<!--##### Note This Repository Nees Some Cleaning-->

### Getting Started


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







##### Browser
mew-connect-client can be included for use in the browser via webpack or browerfy


<!-- ##### API -->




