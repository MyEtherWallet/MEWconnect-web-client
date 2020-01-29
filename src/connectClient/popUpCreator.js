import path from 'path';
import QrCode from 'qrcode';
// import Initiator from './connectClient/MewConnectInitiator';
// import Web3 from 'web3';
// import MEWProvider from './web3Provider/wallets/web3-provider';
// import Networks from './web3Provider/wallets/networks';
// import url from 'url';

const IPCMessageType = {
  SESSION_ID_REQUEST: 'SESSION_ID_REQUEST',
  SESSION_ID_RESPONSE: 'SESSION_ID_RESPONSE',
  LINKED: 'LINKED',
  UNLINKED: 'UNLINKED',
  WEB3_REQUEST: 'WEB3_REQUEST',
  WEB3_REQUEST_CANCELED: 'WEB3_REQUEST_CANCELED',
  WEB3_RESPONSE: 'WEB3_RESPONSE',
  LOCAL_STORAGE_BLOCKED: 'LOCAL_STORAGE_BLOCKED'
};

export default class PopUpCreator {
  constructor(linkUrl) {
    this.walletLinkUrl = linkUrl || 'connect-MEWconnect';
    this.sessionId = '';
    this.sessionId = false;
  }


  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  showPopupWindow(qrcode) {
    console.log('showPopupWindow'); // todo remove dev item
    if(!qrcode){
      throw Error("No connection string supplied to popup window")
    }
    console.log('open?'); // todo remove dev item
    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    if (this.popupWindow && this.popupWindow.opener) {
      if (this.popupUrl !== popupUrl) {
        this.popupWindow.location.href = popupUrl;
        this.popupUrl = popupUrl;
      }
      this.popupWindow.focus();
      return;
    }

    const width = 320;
    const height = 520;
    const left = Math.floor(window.outerWidth / 2 - width / 2 + window.screenX);
    const top = Math.floor(window.outerHeight / 2 - height / 2 + window.screenY);
    this.popupUrl = popupUrl;
    this.popupWindow = window.open(
      popupUrl,
      '_blank',
      [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'location=yes',
        'menubar=no',
        'resizable=no',
        'status=no',
        'titlebar=yes',
        'toolbar=no'
      ].join(',')
    );

    this.popupWindow.document.write('<body><canvas id="canvas"></canvas></body>');
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode);
  }

  closePopupWindow() {
    console.log(this.popupWindow); // todo remove dev item
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupUrl = null;
      this.popupWindow = null;
    }
    window.focus();
  }

  handleBeforeUnload(_evt) {
    this.closePopupWindow();
  }
}