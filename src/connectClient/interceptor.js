import debugLogger from 'debug';
const debug = debugLogger('MEWconnect:webRTC-interceptor');


export default class Interceptor {
  constructor() {
    this.address = false;
    this.SIGN_TX = 'signTx';
    this.ADDRESS = 'address';
  }

  isJSON(value) {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  setWalletAddress(address) {
    try {
      if (address.address) {
        this.address = address.address;
      } else {
        this.address = address;
      }
    } catch (e) {
      debug(e);
    }
  }

  convertToJson(arg) {
    let convertBack = false;
    try {
      if (typeof arg === 'string') {
        if (this.isJSON(arg)) {
          convertBack = true;
          return [JSON.parse(arg), convertBack]
        }
      }
      return [arg, convertBack]
    } catch (e) {
      debug(e);
      return [arg, convertBack]
    }
  }

  InspectOutgoingMessageString(arg) {
    try {
      let temp = this.convertToJson(arg);
      let data2 = temp[0];
      if (data2.type === this.SIGN_TX) {
        let temp2 = this.convertToJson(data2.data);
        let dataUpdated = this.checkForFromValueInSignTx(temp2[0]);
        if(temp2[1]){
          data2.data = JSON.stringify(dataUpdated);
        }
      }
      if(temp[1]){
        return JSON.stringify(data2);
      }
      return arg;
    } catch (e) {
      debug(e);
      return arg;
    }
  }

  InspectOutgoingMessage({type, data, id}) {

    try {
      if (type === this.SIGN_TX) {
        let temp = this.convertToJson(data);
        let data2 = this.checkForFromValueInSignTx(temp[0]);
        if(temp[1]){
          data2 = JSON.stringify(data2);
        }
        return {type, data: data2, id};
      }
      return {type, data, id};
    } catch (e) {
      debug(e);
      return {type, data, id};
    }
  }

  InspectIncomingMessage(data) {
    try {
      if (data.type === this.ADDRESS) {
        this.setWalletAddress(data.data);
      }
      return data;
    } catch (e) {
      debug(e);
      return data;
    }
  }

  checkForFromValueInSignTx(data) {
    try {
      if (!data.from) {
        if (this.address) {
          data.from = this.address;
          return data;
        }
      }
      return data;
    } catch (e) {
      debug(e);
      return data;
    }
  }
}
