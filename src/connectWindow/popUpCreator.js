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
import { ANDROID_LINK, IOS_LINK } from '../config';
import EventEmitter from 'events';

export default class PopUpCreator extends EventEmitter {
  constructor() {
    super();
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

    if (!document.getElementById('Attach-Mew-Wallet-Modal')) {
      this.container = window.document.createElement('div');
      this.container.id = 'Attach-Mew-Wallet-Modal';
      window.document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('Attach-Mew-Wallet-Modal');
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

  cancelConnectionSetup() {
    try {
      this.popupWindowOpen = null;
      this.hideNotifier();
      this.closePopupWindow();
      this.windowClosedListener();
    } catch (e) {
      console.error(e);
    }
  }

  showQrError() {
    const notify = document.getElementById('qr-failure');
    document.querySelector('#qrcodeError').classList.remove('is-visible');
    notify.className = 'hidden';
  }

  showConnecting() {
    // todo: add existance checks because these are destroyed on a good connection
    document
      .querySelector('#qr-code-display-container-mew')
      .classList.add('hidden');
    document
      .querySelector('#qr-code-connecting-mew')
      .classList.remove('hidden');
  }

  hideConnecting() {
    document
      .querySelector('#qr-code-display-container-mew')
      .classList.remove('hidden');
    document.querySelector('#qr-code-connecting-mew').classList.add('hidden');
  }

  showRetry(callback) {
    const retry = document.getElementById('retry-button-mew');
    const retryOnModal = document.getElementById('refresh-container');
    if (document.querySelector('#refresh-container'))
      document.querySelector('#refresh-container').classList.remove('hidden');
    if (document.querySelector('#retry-button-mew'))
      document.querySelector('#retry-button-mew').classList.remove('hidden');
    const eventHandler = () => {
      if (document.querySelector('#qr-code-display-container-mew'))
        document
          .querySelector('#qr-code-display-container-mew')
          .classList.remove('hidden');
      if (document.querySelector('#qr-code-connecting-mew'))
        document
          .querySelector('#qr-code-connecting-mew')
          .classList.add('hidden');
      if (document.querySelector('#retry-button-mew'))
        document.querySelector('#retry-button-mew').classList.add('hidden');
      if (document.querySelector('#refresh-container'))
        document.querySelector('#refresh-container').classList.add('hidden');
      if (retry)
        retry.removeEventListener('click', eventHandler, {
          passive: false,
          once: true
        });
      if (retryOnModal)
        retryOnModal.removeEventListener('click', eventHandler, {
          passive: false,
          once: true
        });
      callback();
    };
    if (retry)
      retry.addEventListener('click', eventHandler, {
        passive: false,
        once: true
      });
    if (retryOnModal)
      retryOnModal.addEventListener('click', eventHandler, {
        passive: false,
        once: true
      });
  }

  createQrCodeModal() {
    const modalId = 'Mew-Wallet-Modal';
    if (document.getElementById(modalId)) {
      return;
    }
    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = modalCSS(cssStyles);
    else css.innerText = modalCSS(cssStyles);
    this.container.appendChild(css);
    const div = window.document.createElement('div');
    div.id = modalId;
    // div.className = 'hidden';
    div.innerHTML = modalFrame(
      htmlDesign(
        this.refreshIcon,
        this.spaceman,
        this.playStoreButton,
        this.appStoreButton,
        this.camera,
        this.closeIconBlack,
        IOS_LINK,
        ANDROID_LINK
      )
    );
    // div.innerHTML = windowInformer(spaceman);
    this.container.appendChild(div);
  }

  hideDialog() {
    if (
      document.querySelector('.mew-wallet-modal') &&
      document.querySelector('.mew-wallet-modal-container-mew-modal')
    ) {
      document
        .querySelector('.mew-wallet-modal')
        .classList.remove('is-visible');
      document
        .querySelector('.mew-wallet-modal-container-mew-modal')
        .classList.remove('is-visible');
      document
        .querySelector('.mew-wallet-modal-dialog')
        .classList.remove('is-visible');
    }
  }

  showDialog() {
    if (typeof this.popupWindowOpen !== 'boolean') return;
    this.popupWindowOpen = true;
    if (
      document.querySelector('.mew-wallet-modal') &&
      document.querySelector('.mew-wallet-modal-container-mew-modal')
    ) {
      document.querySelector('.mew-wallet-modal').classList.add('is-visible');
      document
        .querySelector('.mew-wallet-modal-container-mew-modal')
        .classList.add('is-visible');
      document
        .querySelector('.mew-wallet-modal-dialog')
        .classList.add('is-visible');
    }
  }

  showPopupWindow(qrcode) {
    try {
      if (typeof this.popupWindowOpen === 'boolean') {
        this.showDialog();
        return this.container;
      }

      if (!qrcode) {
        const QRfailedMessage = document.getElementById('qr-failure');
        QRfailedMessage.innerText = 'Error: Please start connection again.';
        // todo Instead of not showing. present a notice and ask the user to retry.
        // this.emit('fatalError');
        // window.alert('Failed to create MEW wallet QRcode. Please retry.');
        // throw Error('No connection string supplied to popup window');
      }

      this.createQrCodeModal();
      this.createWindowInformer();

      const element = document.getElementById('canvas-for-mewconnect-qr-code');
      QrCode.toCanvas(element, qrcode, {
        errorCorrectionLevel: 'H',
        width: 200
      });

      const background = document.getElementById('mew-wallet-modal');
      const background2 = document.getElementById('mew-wallet-modal-container');
      const dialog = document.getElementById('mew-mobile-modal-dialog');
      document
        .getElementById('close-mew-modal')
        .addEventListener('click', () => {
          this.cancelConnectionSetup();
        });
      background.addEventListener('click', () => {
        this.hideDialog();
      });
      background2.addEventListener('click', evt => {
        this.hideDialog(evt);
      });
      dialog.addEventListener(
        'click',
        evt => {
          if (this.popupWindowOpen) {
            evt.stopPropagation();
          }
        },
        false
      );
      this.showWindowInformer();
      this.popupWindow = this.container;
      this.popupWindowOpen = true;

      if (qrcode === '') {
        this.showQrError();
      }
      if (!qrcode) {
        const QRfailedMessage = document.getElementById('qr-failure');
        QRfailedMessage.innerText = 'Error: Please start connection again.';
        // todo Instead of not showing. present a notice and ask the user to retry.
        this.emit('fatalError');
        window.alert('Failed to create MEW wallet QRcode. Please retry.');
        throw Error('No connection string supplied to popup window');
      }
      return this.container;
    } catch (e) {
      // todo Instead of not showing. present a notice and ask the user to retry.
      throw Error(e);
    }
  }

  updateQrCode(qrcode) {
    const element = document.getElementById('canvas-for-mewconnect-qr-code');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });
  }

  closePopupWindow() {
    try {
      this.popupWindowOpen = null;
      document
        .querySelector('#Attach-Mew-Wallet-Modal')
        .dispatchEvent(new Event('mewModalClosed'));
      document.querySelector('#Attach-Mew-Wallet-Modal').replaceChildren();
    } catch (e) {
      this.popupWindowOpen = null;
      document.querySelector('#Attach-Mew-Wallet-Modal').innerHTML = '';
    }
  }

  handleBeforeUnload() {}
  resetSetup() {
    this.popupWindowOpen = null;
    this.hideNotifier();
    this.closePopupWindow();
  }
}
