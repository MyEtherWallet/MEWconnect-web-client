### Release v2.1.0-RC.5.12
- pass JSON RPC errors through to callback
- Quietly handle 'subscription not found' error by default with settable option to return as error


### Release v2.1.0-RC.5.11
- add popupWindowClosed event to provider object to inform when popup window is closed.

### Release v2.1.0-RC.5.10
- Fallback to getting gas price from chain if one is not supplied

### Release v2.1.0-RC.5.9
- Fix event signaling disconnect for mew web not propagating
- Refactor signal server url locations

### Release v2.1.0-RC.5.8
- Emit error when popup is closed via closing the window or clicking cancel

### Release v2.1.0-RC.5.7
- Add option to emit error when popup is closed
- Design modifications

### Release v2.1.0-RC.5.4
- Remove refreshing QRcode. 
- better error handling between V1 and V2 connection types

### Release v2.1.0-RC.5.3
- Add missing package to package.json. 

### Release v2.1.0-RC.5.2
- Modify/Improve fallback flow
- Refresh QRcode continuously after so many seconds

### Release v2.1.0-beta.6
- fix missing property in MewConnectInitiator [this.iceStates]

### Release v2.1.0-beta.5
- MEWconnect disconnecting after connection fix

### Release v2.1.0-beta.4
- version 2 (MEW mobile) turn connection fix

### Release v2.1.0
- Refactor version 1 and version 2 checking and selection
- Include stand alone provider

### Release v2.0.0-beta.23
- Include both version 1 and version 2 and allow for seamless connection from app using either

### Release v1.0.4
- Switch from webpack to rollup
- clean unused code
- removed initiatorClient and recieverClient
- add prettier
- reduce examples to pre-built MyEtherWallet

### Release v0.0.1-alpha.4
### Fixes
- Gracefully handle disconnect call when webrtc never initiated

### Release v0.0.1-alpha.3

