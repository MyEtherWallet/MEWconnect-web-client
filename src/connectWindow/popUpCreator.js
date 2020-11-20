/* eslint-disable */
import QrCode from 'qrcode';
import {
  appStoreButton,
  camera,
  closeIconBlack,
  logo,
  playStoreButton,
  refresh,
  spaceman
} from './images/index';
import {
  cssStyles,
  htmlDesign,
  modalCSS,
  modalFrame,
  noticetext,
  windowInformer
} from './popupWindowDesign';
import debugLogger from 'debug';

// TODO add debug logging
const debug = debugLogger('MEWconnect:popup-window');
// const debugConnectionState = debugLogger('MEWconnect:connection-state');

debug;
export default class PopUpCreator {
  constructor() {
    this.sessionId = '';
    this.sessionId = false;
    this.logo = logo;
    this.spaceman = spaceman;
    this.refreshIcon = refresh;
    this.playStoreButton = playStoreButton;
    this.appStoreButton = appStoreButton;
    this.camera = camera;
    this.closeIconBlack = closeIconBlack;
    this.popupWindowOpen = null;
    this.windowClosedListener = () => {};

    if(!document.getElementById('Attach-Mew-Wallet-Modal')){
      this.container = window.document.createElement('div');
      this.container.id = 'Attach-Mew-Wallet-Modal';
      window.document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('Attach-Mew-Wallet-Modal')
    }


    window.addEventListener('beforeunload', () => {
      this.closePopupWindow();
    });
  }

  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  get window() {
    return this.popupWindow;
  }

  setWindowClosedListener(func) {
    this.windowClosedListener = func;
  }

  removeWindowClosedListener() {
    this.windowClosedListener = () => {};
  }

  hideNotifier() {
    const notify = document.getElementById('Notifications');
    notify.className = 'hidden';
  }

  createWindowInformer() {
    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = noticetext;
    else css.innerText = noticetext;
    this.container.appendChild(css);
    const div = window.document.createElement('div');
    div.id = 'Notifications';
    div.className = 'hidden';

    div.innerHTML = windowInformer(spaceman);
    this.container.appendChild(div);
  }

  showWindowInformer() {
    const notify = document.getElementById('Notifications');
    notify.className = 'shown';

    const showButton = document.getElementById('NotificationButton1');
    showButton.addEventListener('click', () => {
      this.showDialog();
    });

    const cancelButton = document.getElementById('NotificationButton2');
    cancelButton.addEventListener('click', () => {
      this.cancelConnectionSetup();
    });
  }

  cancelConnectionSetup(){
    this.popupWindowOpen = null;
    this.hideNotifier();
    this.closePopupWindow();
  }

  createQrCodeModal() {
    this.popupWindowOpen = true;
    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = modalCSS(cssStyles);
    else css.innerText = modalCSS(cssStyles);
    this.container.appendChild(css);
    const div = window.document.createElement('div');
    div.id = 'Mew-Wallet-Modal';
    // div.className = 'hidden';
    div.innerHTML = modalFrame(
      htmlDesign(
        this.refreshIcon,
        this.spaceman,
        this.playStoreButton,
        this.appStoreButton,
        this.camera,
        this.closeIconBlack
      )
    );
    // div.innerHTML = windowInformer(spaceman);
    this.container.appendChild(div);
  }

  hideDialog(evt) {
    if (
      document
        .querySelector('.mew-wallet-modal')
         && document
        .querySelector('.mew-wallet-modal-container')
    ) {
      document
        .querySelector('.mew-wallet-modal')
        .classList.remove('is-visible');
      document
        .querySelector('.mew-wallet-modal-container')
        .classList.remove('is-visible');
      document
        .querySelector('.modal-dialog')
        .classList.remove('is-visible');
    }
  }

  showDialog(evt) {
    if(typeof this.popupWindowOpen !== 'boolean') return;
    this.popupWindowOpen = true;
    if (
      document
        .querySelector('.mew-wallet-modal')
      && document
        .querySelector('.mew-wallet-modal-container')
    ) {
      document
        .querySelector('.mew-wallet-modal')
        .classList.add('is-visible');
      document
        .querySelector('.mew-wallet-modal-container')
        .classList.add('is-visible');
      document
        .querySelector('.modal-dialog')
        .classList.add('is-visible');
    }
  }

  showPopupWindow(qrcode) {
    if(typeof this.popupWindowOpen === 'boolean'){
      this.showDialog();
      return this.container;
    }

    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }

    this.createQrCodeModal();
    this.createWindowInformer();

    const element = document.getElementById(
      'canvas-for-mewconnect-qr-code'
    );
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });

    const background = document.getElementById('mew-wallet-modal');
    const background2 = document.getElementById('mew-wallet-modal-container');
    const dialog = document.getElementById('mew-mobile-modal-dialog');
    document.getElementById('close-mew-modal').addEventListener('click', () => {
      this.cancelConnectionSetup();
    });

    background.addEventListener('click', (evt) => {
      this.hideDialog();
    });
    background2.addEventListener('click', (evt) => {
      this.hideDialog(evt);
    });
    dialog.addEventListener('click', (evt) => {
      if(this.popupWindowOpen) {
        evt.stopPropagation();
      }
    }, false);
    this.showWindowInformer();
    this.popupWindow = this.container;
    this.popupWindowOpen = true;
    return this.container;
  }

  updateQrCode(qrcode) {
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });
  }

  closePopupWindow() {
    // this.hideDialog();
    this.container.dispatchEvent(new Event('mewModalClosed'))
    this.container.replaceChildren();
    this.popupWindowOpen = null;
  }

  handleBeforeUnload() {
    // this.closePopupWindow();
  }
}
