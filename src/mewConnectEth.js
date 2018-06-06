

class MewConnectEth {
  constructor(callback) {
    this.listeners = [];
    if (callback) {
      this.callback = callback;
    } else {
      // this.callback = this.mewConnectCallback;
    }
    this.walletCallback = null;
    this.signalerUrl = 'https://35.160.138.139:3001';
  }


  getCallback() {
    return this.callback;
  }

  setMewConnect(mewConnect) {
    this.comm = mewConnect;
  }

  signalerConnect(url) {
    if (!url) {
      this.comm.initiatorStart(this.signalerUrl);
    } else {
      this.comm.initiatorStart(url);
    }
  }


  setWalletCallback(func) {
    this.walletCallback = func;
  }


  // eslint-disable-next-line class-methods-use-this
  createWallet(data) {
    let address = data.address;
    const pub = data.pub;
    let wallet;
    if (address.substring(0, 2) !== '0x') {
      address = `0x${address}`;
    }
    console.log('decryptWalletCtrl:334', data); // todo remove dev item
    // eslint-disable-next-line no-undef
    if (Validator.isValidAddress(address)) {
      // eslint-disable-next-line no-undef
      const tempWallet = new Wallet();
      // eslint-disable-next-line func-names
      tempWallet.getAddressString = function () {
        return address;
      };
      const balance = tempWallet.setBalance(_data => _data);
      console.log(balance); // todo remove dev item
      wallet = {
        // type: "addressOnly",
        type: 'mewConnect',
        address,
        pubKey: pub,
        getAddressString: tempWallet.getAddressString,
        getChecksumAddressString() {
          // eslint-disable-next-line no-undef
          return ethUtil.toChecksumAddress(this.getAddressString());
        },
        getBalance() {
          return this.balance;
        },
        setBalance: tempWallet.setBalance,
        setTokens: tempWallet.setTokens,
        getPath() {
          console.log('mewConnectEth:209', 'GET PATH'); // todo remove dev item
        },
        getHWTransport() {
          console.log('mewConnectEth:212', 'GET HARDWARE TRANSPORT'); // todo remove dev item
        },
        getHWType() {
          console.log('mewConnectEth:215', 'GET HARDWARE TYPE'); // todo remove dev item
          return 'mewConnect';
        },
      };
      return wallet;
    }
    // todo add error message (address not valid)
    console.error('decryptWalletCtrl:355', 'NOT VALID?'); // todo remove dev item
    return false;
  }

  signMessageSend(msg) {
    this.comm.sendRtcMessageDirect('sign', msg);
  }

  getPublic(path, callback) {
    const self = this;
    self.comm.sendRtcMessage('publicKey', '');
    self.comm.use((data, next) => {
      if (data.type === 'publicKey') {
        console.log(data);
        callback('publicKey', data.data);
      } else {
        next();
      }
    });
  }

  signTransaction(eTx, rawTx) {
    const self = this;
    // const hashToSign = eTx.hash(false).toString('hex');
    console.log('mewConnectEth:326', rawTx); // todo remove dev item
    self.comm.sendRtcMessageDirect('signTx', JSON.stringify(rawTx));
  }

  signMessage(messageHex) {
    const self = this;
    // const hashToSign = messageHex.toString('hex');
    self.comm.sendRtcMessageDirect('signMessage', messageHex);
  }
}


module.exports = MewConnectEth;
