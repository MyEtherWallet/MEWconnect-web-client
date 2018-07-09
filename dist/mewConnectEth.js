'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MewConnectEth = function () {
  function MewConnectEth(callback) {
    _classCallCheck(this, MewConnectEth);

    this.listeners = [];
    if (callback) {
      this.callback = callback;
    } else {
      // this.callback = this.mewConnectCallback;
    }
    this.walletCallback = null;
    this.signalerUrl = 'https://35.160.138.139:3001';
  }

  _createClass(MewConnectEth, [{
    key: 'getCallback',
    value: function getCallback() {
      return this.callback;
    }
  }, {
    key: 'setMewConnect',
    value: function setMewConnect(mewConnect) {
      this.comm = mewConnect;
    }
  }, {
    key: 'signalerConnect',
    value: function signalerConnect(url) {
      if (!url) {
        this.comm.initiatorStart(this.signalerUrl);
      } else {
        this.comm.initiatorStart(url);
      }
    }
  }, {
    key: 'setWalletCallback',
    value: function setWalletCallback(func) {
      this.walletCallback = func;
    }

    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'createWallet',
    value: function createWallet(data) {
      var address = data.address;
      var pub = data.pub;
      var wallet = void 0;
      if (address.substring(0, 2) !== '0x') {
        address = '0x' + address;
      }
      console.log('decryptWalletCtrl:334', data); // todo remove dev item
      // eslint-disable-next-line no-undef
      if (Validator.isValidAddress(address)) {
        // eslint-disable-next-line no-undef
        var tempWallet = new Wallet();
        // eslint-disable-next-line func-names
        tempWallet.getAddressString = function () {
          return address;
        };
        var balance = tempWallet.setBalance(function (_data) {
          return _data;
        });
        console.log(balance); // todo remove dev item
        wallet = {
          // type: "addressOnly",
          type: 'mewConnect',
          address: address,
          pubKey: pub,
          getAddressString: tempWallet.getAddressString,
          getChecksumAddressString: function getChecksumAddressString() {
            // eslint-disable-next-line no-undef
            return ethUtil.toChecksumAddress(this.getAddressString());
          },
          getBalance: function getBalance() {
            return this.balance;
          },

          setBalance: tempWallet.setBalance,
          setTokens: tempWallet.setTokens,
          getPath: function getPath() {
            console.log('mewConnectEth:209', 'GET PATH'); // todo remove dev item
          },
          getHWTransport: function getHWTransport() {
            console.log('mewConnectEth:212', 'GET HARDWARE TRANSPORT'); // todo remove dev item
          },
          getHWType: function getHWType() {
            console.log('mewConnectEth:215', 'GET HARDWARE TYPE'); // todo remove dev item
            return 'mewConnect';
          }
        };
        return wallet;
      }
      // todo add error message (address not valid)
      console.error('decryptWalletCtrl:355', 'NOT VALID?'); // todo remove dev item
      return false;
    }
  }, {
    key: 'signMessageSend',
    value: function signMessageSend(msg) {
      this.comm.sendRtcMessageDirect('sign', msg);
    }
  }, {
    key: 'getPublic',
    value: function getPublic(path, callback) {
      var self = this;
      self.comm.sendRtcMessage('publicKey', '');
      self.comm.use(function (data, next) {
        if (data.type === 'publicKey') {
          console.log(data);
          callback('publicKey', data.data);
        } else {
          next();
        }
      });
    }
  }, {
    key: 'signTransaction',
    value: function signTransaction(eTx, rawTx) {
      var self = this;
      // const hashToSign = eTx.hash(false).toString('hex');
      console.log('mewConnectEth:326', rawTx); // todo remove dev item
      self.comm.sendRtcMessageDirect('signTx', JSON.stringify(rawTx));
    }
  }, {
    key: 'signMessage',
    value: function signMessage(messageHex) {
      var self = this;
      // const hashToSign = messageHex.toString('hex');
      self.comm.sendRtcMessageDirect('signMessage', messageHex);
    }
  }]);

  return MewConnectEth;
}();

module.exports = MewConnectEth;