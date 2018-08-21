<!--##### Note This Repository Nees Some Cleaning-->

### Getting Started


### Running the Example:
The example requires both MEWconnect-Client (this repo) and MEWconnect-Signal-Server (mew-signer-hs)
>Clone the repo:

`git clone <repo address>`

>Install the dependencies:

`npm install`

>Start the server serving the example initiator and receiver:

`npm start`

###### Get the signaling server
>Clone the repo:

`git clone <repo address>`

>Install the dependencies:

`npm install`

>Start the signaling server:

`npm start`

<!--### Launching demo-->

<!-->Open two browser tabs/windows:-->

<!--navigate one to https://localhost:3100/initiator-->

<!--navigate the other to https://localhost:3100/receiver-->

<!--_**Note:** You may need to navigate to https://localhost:3200 to accept the self-signed certificate used in the example_-->

### Usage
> In the browser via the file /browser/MewConnect.min.js

Two Peers are needed with one designated as the Initiator and the other as the Receiver.


```javascript
let mewConnectClient = new MewConnect.Client(communicatorFunc, loggingFunc, depends);
```
_(MewConnect.Client takes the same parameters)_

The MewConnect takes:
- communicatorFunc (Optional):
    - A function or null
    - If a function it is called on each lifeCycle event.
    - with two arguments:
      - a String denoting the specific signal
      - null or an object containing data related to the signal;
  ```javascript
        let signalStateChange = function(signal, data){
          if(signal === "codeDisplay"){
              console.log(data); // this is the code that gets entered into the receiver
            };
          };
   ```
    - If null listeners can be attached for specific lifecycle events via ``` registerLifeCycleListener```


- loggingFunc (Optional):
    - a optional function to provide logging or null (to use the default)
- additionalLibs (Optional):
    - a dictionary (object) containing dependencies as they are declared in the scope.
      - the dependencies are:
        - node.js crypto or polyfill
        - secp256k1
        - ethereumjs-util
        - node.js buffer.Buffer  (e.g. require("buffer").Buffer) or polyfill
        - simple-peer or MewRTC (an ES6 port of simple-peer)
    - ```javascript
          let cryptoFuncs = new MewConnect.Crypto(crypto, secp256k1, ethereumjs-util, buffer.Buffer);

          let depends = {wrtc: MewRTC,
               cryptoImpl: cryptoFuncs,
                io: io,
                ethUtils: ""
          };
      ```

The url of the signaling server is passed to the _initiatorStart_ method on MewConnectInitiator which begins the sequence by connecting to the signaling server and waiting for the signal indicating a receiver peer is ready.
```javascript
let url = "https://localhost:3001";  //Url to the signaling server
mewConnectInitiator.initiatorStart(url);
```

#### Initiator

```javascript
let mewConnectInitiator = new MewConnect.Initiator(communicatorFunc, loggingFunc, depends);
```




#### Receiver

```javascript
let mewConnectReceiver = new MewConnect.Receiver(communicatorFunc, loggingFunc, depends);
```

The url of the signaling server and an object containing the key and connection Id from the initiator is passed to the _receiverStart_ method on MewConnect.  This begins the sequence of connecting to the signaling server and then creating the WebRTC connection between the Initiator and Receiver.
- if no initiator peer exists for the Receiver then the connection will fail.

```javascript
let parameters = {
    key: "part of the connection code before the dash",
    connId: "part of the connection code after the dash"
};
```
_or using the helper on MewConnect_

```javascript
let parameters = mewConnectReceiver.parseConnectionDetailString(connectionCode);
```

```javascript
let url = "https://localhost:3001"; //Url to the signaling server
mewConnectReceiver.receiverStart(url, parameters);
```


##### Webpack

The dist folder version contains only the Web Client for use in a bundle via a require call.

##### Browser
The contents of the browser directory expose all the components for setting up the Web Core, and a Client on window.

It can be added via a script tag:
```
<script src="./browser/MewConnect.min.js"></script>
```


<!-- ##### API -->




