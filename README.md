# mew-signer-peer
Client For mew-signer-hs


### Getting Started

git clone <repo address>

npm install

npm start

npm start:signal

navigate one tab/window to https://localhost:3000/initiator

navigate another tab/window to https://localhost:3000/receiver

_**Note:** You may need to navigate to https://localhost:3001 to accept the self-signed certificate used in the example_

### Launching demo


### Usage

Two Peers are needed with one designated as the Initiator and the other as the Receiver.


```ecmascript 6
let mewConnect = new MewConnect(signalStateChange, logger, depends);
```
The constructor takes:
- first argument:  
    - A listener for lifecycle events or null
    -  ```\
        let signalStateChange = function(signal, data){
          if(signal === "codeDisplay"){
              console.log(data); // this is the code that gets entered into the receiver
            };
          };
          ```
        - If null listeners can be attached for specific lifecycle events via ```registerLifeCycleListener```


- second argument:
    - a optional logger or null (to use the default)
- third argument: 
    - a dictionary (object) containing dependencies as they are declared in the scope.
    - ```ecmascript 6
          let cryptoFuncs = new MewConnectCrypto(CCrypto.crypto, CCrypto.secp256k1, EthUtilities, BBuffer.Buffer);
          
          let depends = {wrtc: MewRTC,
               cryptoImpl: cryptoFuncs,
                io: io, 
                ethUtils: ""
          };
      ```
        - Note: If running under node (e.g. using webpack or browserfy) this can be omitted as the dependencies will be required via node.js's require during the build process.

#### Initiator

The url of the signaling server is passed to the initiatorStart method on MewConnectInitiator which begins the sequence by connecting to the signaling server and waiting for the signal indicating a receiver peer is ready.
```ecmascript 6
let url = "https://localhost:3000/initiator";
mewConnect.initiatorStart(url);
```


#### Receiver

The url of the signaling server and an object containing the key and connection Id from the initiator is passed to the receiverStart method on MewConnect.  This begins the sequence of connecting to the signaling server and then creating the WebRTC connection between the Initiator and Receiver.
- if no initiator peer exists for the Receiver then the connection will fail.

```ecmascript 6
let url = "https://localhost:3000/initiator";
mewConnect.initiatorStart(url);
```