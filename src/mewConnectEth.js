"use strict";



class MewConnectEth {
    constructor(callback) {
        this.listeners = [];
        if (callback) {
            this.callback = callback;
        } else {
            // this.callback = this.mewConnectCallback;
        }
        this.walletCallback = null;
        this.signalerUrl = "https://35.160.138.139:3001";
    }


    getCallback() {
        return this.callback;
    }

    setMewConnect(mewConnect) {
        this.comm = mewConnect;
    }

    signalerConnect(url) {
        if(!url){
            this.comm.initiatorStart(this.signalerUrl);
        } else {
            this.comm.initiatorStart(url);
        }

    }

    // recieveAddress() {
    //     this.callback()
    // }

    setWalletCallback(func) {
        this.walletCallback = func;
    }

    // getAddress($scope, walletService) {
    //     return function (data, next) {
    //         if (data.type) {
    //             switch (data.type.trim()) {
    //                 case "address":
    //                     this.setWallet($scope, walletService, data, next);
    //                     this.callback(data);
    //                     break;
    //                 default:
    //                     next();
    //                     break;
    //             }
    //         }
    //     }.bind(this);
    // };

    createWallet(data) {
        let address = data.address;
        let pub = data.pub;
        let wallet;
        if (address.substring(0, 2) != "0x") {
            address = "0x" + address;
        }
        console.log("decryptWalletCtrl:334", data); //todo remove dev item
        if (Validator.isValidAddress(address)) {
            var tempWallet = new Wallet();
            tempWallet.getAddressString = function(){
                return address;
            };
            var balance = tempWallet.setBalance(function(data){
                return data;
            });
            console.log(balance); //todo remove dev item
            wallet = {
                // type: "addressOnly",
                type: "mewConnect",
                address: address,
                pubKey: pub,
                getAddressString: tempWallet.getAddressString,
                getChecksumAddressString: function () {
                    return ethUtil.toChecksumAddress(this.getAddressString());
                },
                getBalance: function(){
                    return this.balance;
                },
                setBalance: tempWallet.setBalance,
                setTokens: tempWallet.setTokens,
                getPath: function (stuff) {
                    console.log("mewConnectEth:209", "GET PATH"); //todo remove dev item
                },
                getHWTransport: function (stuff) {
                    console.log("mewConnectEth:212", "GET HARDWARE TRANSPORT"); //todo remove dev item
                },
                getHWType: function () {
                    console.log("mewConnectEth:215", "GET HARDWARE TYPE"); //todo remove dev item
                    return "mewConnect";
                }
            };
            return wallet;
        } else {
            // todo add error message (address not valid)
            console.error("decryptWalletCtrl:355", "NOT VALID?"); //todo remove dev item
            return false;
        }
    }

    signMessageSend(msg) {
        this.comm.sendRtcMessageDirect("sign", msg);
    }

    getPublic(path, callback) {
        var self = this;
        self.comm.sendRtcMessage("publicKey", "");
        self.comm.use((data, next) => {
            if (data.type === "publicKey") {
                console.log(data);
                callback("publicKey", data.data);
            } else {
                next();
            }
        });
    };

    signTransaction(eTx, rawTx, txData) {
        var self = this;
        var hashToSign = eTx.hash(false).toString('hex');
        console.log("mewConnectEth:326", rawTx); //todo remove dev item
        self.comm.sendRtcMessageDirect("signTx", JSON.stringify(rawTx));
    }

    signMessage(messageHex) {
        var self = this;
        var hashToSign = messageHex.toString('hex');
        self.comm.sendRtcMessageDirect("signMessage", messageHex);
    }
}




module.exports = MewConnectEth;