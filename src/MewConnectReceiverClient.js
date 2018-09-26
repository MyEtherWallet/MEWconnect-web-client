// const MewConnectReceiver = require('./MewConnectReceiver');
//
// export default class MewConnectReceiverClient extends MewConnectReceiver {
//   /**
//    *  extensions to plug callbacks into specific events/occupancies
//    *  without needing to construct separate checking mechanisms
//    *  and expose a factory method.  Primarily for usage in
//    * @param uiCommunicatorFunc
//    * @param loggingFunc
//    * @param additionalLibs
//    */
//   constructor(uiCommunicatorFunc, loggingFunc, additionalLibs) {
//     super(uiCommunicatorFunc, loggingFunc, additionalLibs);
//     this.qrCodeString = null;
//     this.addressCallback = null;
//     this.signerCallback = null;
//     this.messageSignerCallback = null;
//     this.transactionSignerCallback = null;
//     this.codeDisplayCallback = null;
//     this.rtcConnectedCallback = null;
//     this.rtcClosedCallback = null;
//     this.connected = false;
//     this.internalMiddlewareActive = false;
//     this.internalLifeCycleActive = false;
//   }
//
//   static init(uiCommunicatorFunc, loggingFunc, additionalLibs) {
//     if (typeof MewConnect !== 'undefined') {
//       this.instance = new MewConnect(
//         uiCommunicatorFunc,
//         loggingFunc,
//         additionalLibs
//       );
//     } else {
//       this.instance = new MewConnectReceiverClient(
//         uiCommunicatorFunc,
//         loggingFunc,
//         additionalLibs
//       );
//     }
//     return this.instance;
//   }
//
//   /**
//    *
//    * @returns {MewConnect}
//    */
//   static get() {
//     return this.instance;
//   }
//
//   /**
//    *
//    * @returns {boolean}
//    */
//   isInternalMiddlewareActive() {
//     return this.internalMiddlewareActive;
//   }
//
//   /**
//    *
//    * @returns {boolean}
//    */
//   isInternalLifeCycleActive() {
//     return this.internalLifeCycleActive;
//   }
//
//   /**
//    *
//    * @param func
//    */
//   setAddressCallback(func) {
//     this.addressCallback = func;
//   }
//
//   /**
//    *
//    * @param func
//    */
//   setSignerCallback(func) {
//     this.signerCallback = func;
//   }
//
//   /**
//    *
//    * @param func
//    */
//   setMessageSignerCallback(func) {
//     this.messageSignerCallback = func;
//   }
//
//   /**
//    *
//    * @param func
//    */
//   setTransactionSignerCallback(func) {
//     this.transactionSignerCallback = func;
//   }
//
//   /**
//    *
//    * @param uiCommunicationFunc
//    */
//   setCommunicationFunction(uiCommunicationFunc) {
//     this.uiCommunicatorFunc = uiCommunicationFunc;
//   }
//
//   /**
//    *
//    * @param func
//    */
//   registerCodeDisplayCallback(func) {
//     this.registerLifeCycleListener('codeDisplay', func);
//   }
//
//   /**
//    *
//    * @param func
//    */
//   registerRtcConnectedCallback(func) {
//     this.registerLifeCycleListener('RtcConnectedEvent', func);
//   }
//
//   /**
//    *
//    * @param func
//    */
//   registerRtcClosedCallback(func) {
//     this.registerLifeCycleListener('RtcClosedEvent', func);
//   }
//
//   /**
//    *
//    */
//   configureInternalLifecycle() {
//     if (!this.internalLifeCycleActive) {
//       this.internalLifeCycleActive = true;
//       this.use((data, next) => {
//         if (data) {
//           if (data.type) {
//             switch (data.type) {
//               case 'codeDisplay':
//                 if (!this.codeDisplayCallback) {
//                   next();
//                 } else {
//                   this.codeDisplayCallback(data.data);
//                 }
//                 break;
//               case 'RtcConnectedEvent':
//                 this.connected = true;
//                 // if (this.instance) this.instance.connected = true;
//                 if (!this.rtcConnectedCallback) {
//                   next();
//                 } else {
//                   this.rtcConnectedCallback(data.data);
//                 }
//                 break;
//               // case "rtcDisconnect":
//               // case "RtcDisconnectEvent":
//               case 'RtcClosedEvent':
//                 if (!this.rtcClosedCallback) {
//                   next();
//                 } else {
//                   this.rtcClosedCallback(data.data);
//                 }
//                 break;
//               default:
//                 next();
//                 break;
//             }
//           } else {
//             next();
//           }
//         } else {
//           next();
//         }
//       });
//     }
//   }
//
//   /**
//    *
//    */
//   configureInternalMiddleware() {
//     if (!this.internalMiddlewareActive) {
//       this.internalMiddlewareActive = true;
//       this.use((data, next) => {
//         if (data) {
//           if (data.type) {
//             switch (data.type) {
//               case 'address':
//                 if (!this.addressCallback) {
//                   next();
//                 } else {
//                   this.addressCallback(data.data);
//                 }
//                 break;
//               case 'sign':
//                 if (!this.signerCallback) {
//                   next();
//                 } else {
//                   this.signerCallback(data.data);
//                 }
//                 break;
//               case 'signMessage':
//                 if (!this.messageSignerCallback) {
//                   next();
//                 } else {
//                   this.messageSignerCallback(data.data);
//                 }
//                 break;
//               case 'signTx':
//                 if (!this.transactionSignerCallback) {
//                   next();
//                 } else {
//                   this.transactionSignerCallback(data.data);
//                 }
//                 break;
//               default:
//                 next();
//                 break;
//             }
//           } else {
//             next();
//           }
//         } else {
//           next();
//         }
//       });
//     }
//   }
// }
