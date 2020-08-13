import QrCode from 'qrcode';
import {
  logo,
  refresh,
  spaceman,
  playStoreButton,
  appStoreButton,
  camera
} from './images/index';
import {
  cssStyles,
  htmlDesign,
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
    this.popupWindowOpen = false;
    this.windowClosedListener = () => {};

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
    document.body.appendChild(css);
    const div = window.document.createElement('div');
    div.id = 'Notifications';
    div.className = 'hidden';

    div.innerHTML = windowInformer(spaceman);
    window.document.body.appendChild(div);
  }

  showWindowInformer() {
    const notify = document.getElementById('Notifications');
    notify.className = 'shown';

    const showButton = document.getElementById('NotificationButton1');
    showButton.addEventListener('click', () => {
      this.showPopupWindow();
    });

    const cancelButton = document.getElementById('NotificationButton2');
    cancelButton.addEventListener('click', () => {
      this.popupWindowOpen = false;
      this.hideNotifier();
      this.windowClosedListener();
      this.closePopupWindow();
    });
  }

  showPopupWindow(qrcode) {
    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
      return this.popupWindow;
    }
    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }

    this.createWindowInformer();

    const width = 448;
    const height = 558;
    const left = Math.floor(window.outerWidth / 2 - width / 2 + window.screenX);
    const top = Math.floor(
      window.outerHeight / 2 - height / 2 + window.screenY
    );
    this.popupUrl = Math.random().toString();
    this.popupWindow = window.open(
      this.popupUrl,
      'windowName',
      [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'resizable=0'
      ].join(',')
    );
    this.popupWindow.document.write(
      htmlDesign(
        this.refreshIcon,
        this.spaceman,
        this.playStoreButton,
        this.appStoreButton,
        this.camera
      )
    );
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });

    const css = this.popupWindow.document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = cssStyles;
    else css.innerText = cssStyles;
    this.popupWindow.document.body.appendChild(css);

    this.showWindowInformer();
    this.popupWindow.addEventListener('beforeunload', () => {
      this.hideNotifier();
      this.windowClosedListener();
      this.popupWindowOpen = false;
      this.popupWindow = null;
    });

    const channel = new BroadcastChannel('refresh-channel');
    channel.addEventListener('message', val => {
          if(val.data === 'refresh'){
            this.refreshQrcode();
          }
        });

    this.popupWindowOpen = true;
    return this.popupWindow;
  }

  updateQrCode(qrcode) {
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });
  }

  closePopupWindow() {
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupUrl = null;
      this.popupWindow = null;
    }
    this.removeWindowClosedListener();
    window.focus();
  }

  handleBeforeUnload() {
    this.closePopupWindow();
  }
}
