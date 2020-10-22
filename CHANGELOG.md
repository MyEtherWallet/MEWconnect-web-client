### Release v2.1.8
- Change handling of infuraId to permit same id usage on testnets

### Release v2.1.7
- update play store link

### Release v2.1.6
- update app store link

### Release v2.1.5
- add deep linking

### Release v2.1.5-beta.1
- add deep linking
- remove interceptor to transform requests

### Release v2.1.5-beta.1
- add interceptor to transform requests

### Release v2.1.4
- add missing personal_ecRecover method
- Fix flipped parameters for persona_sign

### Release v2.1.3
- Fix user reject action
- Add user reject action to personal_sign (present on eth_sign, eth_sendTransaction, eth_signTransaction)

### Release v2.1.3-beta.3
- User reject action checks, testing, investigation

### Release v2.1.3-beta.2
- Fix notifications for rejected request
- Moved message creation function

### Release v2.1.3-beta.1
- Additional debugging logs under 'MEWconnectWeb3' namespace
- Additional error logs under 'MEWconnectError' namespace
- Additional checks for url
- Fix user rejected request to pass through provider
- code cleanup 

### Release v2.1.2
- bump minor version
- code cleanup 
- No functionality change since v2.1.1-RC.4.6

### Release v2.1.1-RC.4.15
- Just use 'a' tags to open links from popup

### Release v2.1.1-RC.4.14
- Change mechanism for opening app/play store links
- Add popup link to MEW web and MEWconnect Protocol

### Release v2.1.1-RC.4.8 through 4.13
- Add logs to investigate link not working
- Fix notice to unblock popups for app/play store links
- Investigate link blockage

### Release v2.1.1-RC.4.7
- Fix X used for closing notifications
- Add logs to investigate link not working

### Release v2.1.1-RC.4.6
- Identify approval transactions
- Use double logical not to check for infuraId
- Remove redundant id in tx data

### Release v2.1.1-RC.4.5
- Fix 'www.' removal 

### Release v2.1.1-RC.4.4
- Remove 'www.' from begining of hostnames used to identify dapp

### Release v2.1.1-RC.4.3
- revert Provider.isConnected and Provider.getConnectionState to getters

### Release v2.1.1-RC.4.2
- add isMEWconnect as provider check

### Release v2.1.1-RC.4.1
- Fix invalid accounting for message ids
- Remove error condition on unmatched id received

### Release v2.1.1-RC.4
- Move id to same level as type and data in sent messages
- Handle matching of request and response ids in client communication layer

### Release v2.1.1-RC.3.2
- Add reject message type
- Add id to sent 

### Release v2.1.1-RC.3.1
- fix identification of mew sites

### Release v2.1.1-RC.3
- same as v2.1.1-RC.2.1, just a version bump

### Release v2.1.1-RC.2.1
- modification to check in Release v2.1.1-RC.2

### Release v2.1.1-RC.2
- Remove hostname addition when connecting to myetherwallet.com

### Release v2.1.1-RC.1
- Add dapp hostname QRcode
- Add Reject type as a wrtc message type

### Release v2.1.0-RC.5.16
- Bump wrtc version to 0.4.6

### Release v2.1.0-RC.5.15
- Add isMewConnect and name properties to the provider instance (src/connectProvider/index.js)

### Release v2.1.0-RC.5.14
- Add infuraId as an option on the Provider constructor.  If supplied, no parameters are required for the makeWeb3Provider method call.

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

