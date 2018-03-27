let ethUtil = EthUtilities;
let Wallet = EthWallet;

function getAddress(key) {
    let pubKey = ethUtil.privateToPublic(new BBuffer.Buffer(key, "hex"));
    let address = ethUtil.publicToAddress(pubKey);
    console.log("mewConnectUtils:7 : ", pubKey ); //todo remove dev item
    console.log(address.toString("hex"));
    return {address: address.toString("hex"), pub: pubKey.toString("hex")};
}

function getNakedAddress(address) {
    return address.toLowerCase().replace('0x', '');
}

function signTransaction(thisMessage, key) {
    return new Promise((resolve, reject) => {
        let wallet = new Wallet(new BBuffer.Buffer(key, "hex"));
        let message = JSON.parse(thisMessage);
        console.log("mewConnectUtils:19 ", message); //todo remove dev item
        // let buf = new BBuffer.Buffer(thisMessage, "hex").toString("hex");//todo remove dev item
        let tx = new ethereumjs.Tx(message);
        // let pvtBuf = wallet.getPrivateKey();
        tx.sign(new BBuffer.Buffer(key, "hex"));
        let signed = tx.serialize().toString('hex');
        // console.log("mewConnectUtils:26", signed); //todo remove dev item
        // let hash = tx.hash(false);
        // let signed = ethUtil.ecsign(hash, wallet.getPrivateKey());
        // const serializedTx = tx.serialize();
        // let serialized = serializedTx.toString("hex");
        //     let signedJSON = {
        //         r: BBuffer.Buffer.from(signed.r).toString("hex"),
        //         v: BBuffer.Buffer.from([signed.v]).toString("hex"),
        //         s: BBuffer.Buffer.from(signed.s).toString("hex")
        //     };
        //     // let jsonString = JSON.stringify(signedJSON);
        return resolve(signed);
        // let msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage));
        // let signed = ethUtil.ecsign(msg, wallet.getPrivateKey());
        // var combined = BBuffer.Buffer.concat([BBuffer.Buffer.from(signed.r), BBuffer.Buffer.from(signed.s), BBuffer.Buffer.from([signed.v])]);
        // let combinedHex = combined.toString("hex");
        // let signingAddr = wallet.getAddressString();
        // let signedMsg = JSON.stringify({
        //     address: wallet.getAddressString(),
        //     msg: thisMessage,
        //     sig: '0x' + combinedHex,
        //     version: '3',
        //     signer: 'MEW'
        // }, null, 2);
        //
        //
        // if (verifySignedMessage(signedMsg)) {
        //     console.log("mewConnectUtils:31 : ", signed.r, signed.v, signed.s); //todo remove dev item
        //     console.log(`Successfully Signed Message with ${signingAddr}`);
        //     let signedJSON = {
        //         r: BBuffer.Buffer.from(signed.r).toString("hex"),
        //         v: BBuffer.Buffer.from([signed.v]).toString("hex"),
        //         s: BBuffer.Buffer.from(signed.s).toString("hex")};
        //     // let jsonString = JSON.stringify(signedJSON);
        //     // notifier.success('Successfully Signed Message with ' + signingAddr)
        //     // return resolve(signedMsg);
        //     return resolve(signedJSON);
        // } else {
            throw globalFuncs.errorMsgs[12]; //todo replace with functional error msg/reporting setup
            return reject({});
        // }
    })
}

function signMessage(thisMessage, key) {
    return new Promise((resolve, reject) => {
        let wallet = new Wallet(new BBuffer.Buffer(key, "hex"));
        // let msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage));
        // let signed = ethUtil.ecsign(msg, wallet.getPrivateKey());
        // var combined = BBuffer.Buffer.concat([BBuffer.Buffer.from(signed.r), BBuffer.Buffer.from(signed.s), BBuffer.Buffer.from([signed.v])]);
        // let combinedHex = combined.toString("hex");
        // let signingAddr = wallet.getAddressString();
        // let signedMsg = JSON.stringify({
        //     address: wallet.getAddressString(),
        //     msg: thisMessage,
        //     sig: '0x' + combinedHex,
        //     version: '3',
        //     signer: 'MEW'
        // }, null, 2);

        // var msg = new BBuffer.Buffer("0x" + thisMessage, "hex");
        var msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage));
        var signed = ethUtil.ecsign(msg, wallet.getPrivateKey());
        var combined = BBuffer.Buffer.concat([BBuffer.Buffer.from(signed.r), BBuffer.Buffer.from(signed.s), BBuffer.Buffer.from([signed.v])]);
        var combinedHex = combined.toString('hex');
        var signingAddr = wallet.getAddressString();
        let signedMsg= JSON.stringify({
            address: wallet.getAddressString(),
            msg: thisMessage,
            sig: '0x' + combinedHex,
            version: '3',
            signer: 'MEW'
        }, null, 2);

        if (verifySignedMessage(signedMsg)) {
            console.log("mewConnectUtils:31 : ", signed.r, signed.v, signed.s); //todo remove dev item
            console.log(`Successfully Signed Message with ${signingAddr}`);
            let signedJSON = {
                r: BBuffer.Buffer.from(signed.r).toString("hex"),
                v: BBuffer.Buffer.from([signed.v]).toString("hex"),
                s: BBuffer.Buffer.from(signed.s).toString("hex")};
            // let jsonString = JSON.stringify(signedJSON);
            // notifier.success('Successfully Signed Message with ' + signingAddr)
            // return resolve(signedMsg);
            return resolve(signedMsg);
        } else {
        throw globalFuncs.errorMsgs[12]; //todo replace with functional error msg/reporting setup
        return reject({});
        }
    })
}

function verifySignedMessage(signedMsg) {
    try {
        let json = JSON.parse(signedMsg);
        var sig = new BBuffer.Buffer(getNakedAddress(json.sig), 'hex');
        if (sig.length != 65) throw globalFuncs.errorMsgs[12];
        sig[64] = sig[64] == 0 || sig[64] == 1 ? sig[64] + 27 : sig[64];
        let hash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(json.msg));
        if (json.version == '3') {
            if (json.signer == 'trezor') {
                // hash = getTrezorHash(json.msg)
            }
        } else if (json.version == '1') {
            hash = ethUtil.sha3(json.msg)
        }
        let pubKey = ethUtil.ecrecover(hash, sig[64], sig.slice(0, 32), sig.slice(32, 64));
        if (getNakedAddress(json.address) != ethUtil.pubToAddress(pubKey).toString('hex')) throw globalFuncs.errorMsgs[12]; //todo replace with functional error msg/reporting setup
        else {
            // $scope.notifier.success(globalFuncs.successMsgs[6])
            // let verifiedMsg = {
            //   address: json.address,
            //   msg: json.msg,
            //   sig: json.sig,
            //   version: json.version
            // }
            return true;
        }
    } catch (e) {
        // $scope.notifier.danger(e);
        console.error(e);
        return false;
    }
}
