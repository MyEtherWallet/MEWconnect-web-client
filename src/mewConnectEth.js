// import createLogger from 'logging'
// const logger = createLogger('MewConnectEth')
//
// class MewConnectEth {
//   constructor (callback) {
//     this.listeners = []
//     if (callback) {
//       this.callback = callback
//     } else {
//       // this.callback = this.mewConnectCallback;
//     }
//     this.walletCallback = null
//     this.signalerUrl = ''
//   }
//
//   getCallback () {
//     return this.callback
//   }
//
//   setMewConnect (mewConnect) {
//     this.comm = mewConnect
//   }
//
//   signalerConnect (url) {
//     if (!url) {
//       this.comm.initiatorStart(this.signalerUrl)
//     } else {
//       this.comm.initiatorStart(url)
//     }
//   }
//
//   setWalletCallback (func) {
//     this.walletCallback = func
//   }
//
//   // eslint-disable-next-line class-methods-use-this
//   createWallet (data) {
//     let address = data.address
//     const pub = data.pub
//     let wallet
//     if (address.substring(0, 2) !== '0x') {
//       address = `0x${address}`
//     }
//     // // logger.debug('decryptWalletCtrl:334', data) // todo remove dev item
//     // eslint-disable-next-line no-undef
//     if (Validator.isValidAddress(address)) {
//       // eslint-disable-next-line no-undef
//       const tempWallet = new Wallet()
//       // eslint-disable-next-line func-names
//       tempWallet.getAddressString = function () {
//         return address
//       }
//       const balance = tempWallet.setBalance(_data => _data)
//       // logger.debug(balance) // todo remove dev item
//       wallet = {
//         // type: "addressOnly",
//         type: 'mewConnect',
//         address,
//         pubKey: pub,
//         getAddressString: tempWallet.getAddressString,
//         getChecksumAddressString () {
//           // eslint-disable-next-line no-undef
//           return ethUtil.toChecksumAddress(this.getAddressString())
//         },
//         getBalance () {
//           return this.balance
//         },
//         setBalance: tempWallet.setBalance,
//         setTokens: tempWallet.setTokens,
//         getPath () {
//         },
//         getHWTransport () {
//         },
//         getHWType () {
//           return 'mewConnect'
//         }
//       }
//       return wallet
//     }
//     // todo add error message (address not valid)
//     return false
//   }
//
//   signMessageSend (msg) {
//     this.comm.sendRtcMessageDirect('sign', msg)
//   }
//
//   getPublic (path, callback) {
//     const self = this
//     self.comm.sendRtcMessage('publicKey', '')
//     self.comm.use((data, next) => {
//       if (data.type === 'publicKey') {
//         callback('publicKey', data.data)
//       } else {
//         next()
//       }
//     })
//   }
//
//   signTransaction (eTx, rawTx) {
//     const self = this
//     // const hashToSign = eTx.hash(false).toString('hex');
//     // // logger.debug('mewConnectEth:326', rawTx) // todo remove dev item
//     self.comm.sendRtcMessageDirect('signTx', JSON.stringify(rawTx))
//   }
//
//   signMessage (messageHex) {
//     const self = this
//     // const hashToSign = messageHex.toString('hex');
//     self.comm.sendRtcMessageDirect('signMessage', messageHex)
//   }
// }
//
// module.exports = MewConnectEth
