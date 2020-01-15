import path from 'path';
import elem from '../popup/dist/my-element.js';
import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'


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

export default class PopUpHandler {
  constructor() {
    this.sessionId = '';
    this.sessionId = false;
    this.actionsPendingSessionId = [];
    this.walletLinkUrl = 'connect-MEWconnect';
    this.walletLinkOrigin = '';
    // this.injectIframe();
    this.element = elem;
    this.actionsPendingIframeLoad = [];
    console.log(this.element); // todo remove dev item
  }

  makeWeb3Provider(RPC_URL, CHAIN_ID) {}

  show() {
    this.sessionId = false;
    this.openPopupWindow('something');
  }

  injectIframe() {
    if (this.iframeEl) {
      throw new Error('iframe already injected!');
    }

    const iframeEl = document.createElement('iframe');
    iframeEl.className = '_WalletLinkBridge';
    iframeEl.width = '1';
    iframeEl.height = '1';
    iframeEl.style.opacity = '0';
    iframeEl.style.pointerEvents = 'none';
    iframeEl.style.position = 'absolute';
    iframeEl.style.top = '0';
    iframeEl.style.right = '0';
    iframeEl.setAttribute(
      'sandbox',
      'allow-scripts allow-popups allow-same-origin'
    );
    iframeEl.src = `${this.walletLinkUrl}/#/bridge`;
    this.iframeEl = iframeEl;

    window.addEventListener('message', this.handleMessage, false);
    window.addEventListener('beforeunload', this.handleBeforeUnload, false);

    const onIframeLoad = () => {
      this.iframeLoaded = true;
      iframeEl.removeEventListener('load', onIframeLoad, false);
      this.postIPCMessage({ type: IPCMessageType.SESSION_ID_REQUEST });
      this.actionsPendingIframeLoad.forEach(action => action());
      this.actionsPendingIframeLoad = [];
    };
    iframeEl.addEventListener('load', onIframeLoad, false);

    document.documentElement.appendChild(iframeEl);
  }

  postIPCMessage(message) {
    if (!this.iframeLoaded) {
      this.actionsPendingIframeLoad.push(() => {
        this.postIPCMessage(message);
      });
      return;
    }
    if (this.iframeEl && this.iframeEl.contentWindow) {
      this.iframeEl.contentWindow.postMessage(message, this.walletLinkOrigin);
    }
  }

  openPopupWindow(path = 'popup') {
    console.log('open?'); // todo remove dev item
    // if (!this.sessionId) {
    //   this.actionsPendingSessionId.push(() => {
    //     this.openPopupWindow(path);
    //   });
    //   return;
    // }
    // const popupUrl = 'http://localhost:63342/MEWconnect-web-client/web/example/plain-html/demo.html?_ijt=2aph6rg37o0luk3ns28lgbqop1'
    const popupUrl = `${this.walletLinkUrl}/#${path}`;

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
    console.log(popupUrl); // todo remove dev item
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

    let item = this.popupWindow.document.createElement('button');
    item.textContent = "CLICK BUTTON"
    item.addEventListener('click', () =>{
      this.popupWindow.alert("clicked")
    }, false);
    // item.onclick = this.popupWindow.alert("clicked");
    this.popupWindow.document.body.appendChild(item);

    let item2 = this.popupWindow.document.createElement('span');
    item2.textContent = "CLICK BUTTON"
    // item.onclick = this.popupWindow.alert("clicked");
    this.popupWindow.document.body.appendChild(item2);

    // const CustomElement = wrap(Vue, elem);
    // this.popupWindow.customElements.define('my-element-two', CustomElement);
    // console.log(this.popupWindow.document.body); // todo remove dev item
    // let item = this.popupWindow.document.createElement('my-element-two');
    // this.popupWindow.document.body.appendChild(item);
    // let code = this.popupWindow.document.createElement('script');
    // const val = import('../popup/dist/my-element.js').then(console.log);
    // console.log(val); // todo remove dev item
    // code.src = '../../integration/popup/dist/my-element.js'; //elem; //require('../popup/dist/my-element.js');
    // this.popupWindow.document.body.appendChild(code);

    // customElements.define('popup-info', PopUpInfo);
  }

  closePopupWindow() {
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupUrl = null;
      this.popupWindow = null;
    }
    window.focus();
  }

  // invokeCallback(message) {
  //   const callback = WalletLinkRelay.callbacks.get(message.id)
  //   if (callback) {
  //     callback(message.response)
  //     WalletLinkRelay.callbacks.delete(message.id)
  //   }
  // }

  resetAndReload() {
    // this.storage.clear()
    document.location.reload();
  }

  handleMessage(evt) {
    if (evt.origin !== this.walletLinkOrigin) {
      return;
    }

    const message = evt.data;

    // if (isWeb3ResponseMessage(message)) {
    //   const { response } = message
    //
    //   if (isRequestEthereumAccountsResponse(response)) {
    //     Array.from(WalletLinkRelay.accountRequestCallbackIds.values()).forEach(
    //       id => this.invokeCallback({ ...message, id })
    //     )
    //     WalletLinkRelay.accountRequestCallbackIds.clear()
    //     return
    //   }
    //
    //   this.invokeCallback(message)
    //   return
    // }

    // if (isSessionIdResponseMessage(message)) {
    //   const { sessionId } = message
    //   if (this.sessionId !== null && this.sessionId !== sessionId) {
    //     // sessionId changed, clear all local data and reload page
    //     this.resetAndReload()
    //     return
    //   }
    //   this.sessionId = sessionId
    //   // this.setStorageItem(LOCAL_STORAGE_SESSION_ID_KEY, sessionId)
    //
    //   this.actionsPendingSessionId.forEach(action => action())
    //   this.actionsPendingSessionId = []
    //   return
    // }

    // if (isLinkedMessage(message)) {
    //   this.linked = true
    //   return
    // }

    // if (isUnlinkedMessage(message)) {
    //   this.linked = false
    //   this.resetAndReload()
    //   return
    // }

    // if (isLocalStorageBlockedMessage(message)) {
    //   this.localStorageBlocked = true
    //
    //   if (
    //     WalletLinkRelay.accountRequestCallbackIds.size > 0 &&
    //     this.popupWindow
    //   ) {
    //     Array.from(WalletLinkRelay.accountRequestCallbackIds.values()).forEach(
    //       id =>
    //         this.invokeCallback(
    //           Web3ResponseMessage({
    //             id,
    //             response: ErrorResponse(
    //               Web3Method.requestEthereumAccounts,
    //               BLOCKED_LOCAL_STORAGE_ERROR_MESSAGE
    //             )
    //           })
    //         )
    //     )
    //     WalletLinkRelay.accountRequestCallbackIds.clear()
    //     walletLinkBlockedDialog.show()
    //     this.closePopupWindow()
    //   }
    //   return
    // }
  }

  handleBeforeUnload(_evt) {
    this.closePopupWindow();
  }
}