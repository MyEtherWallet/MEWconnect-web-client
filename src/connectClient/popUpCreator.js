import QrCode from 'qrcode';
import logo from '../connectProvider/logoImage';
import {cssStyles, htmlDesign} from './popupWindowDesign'

export default class PopUpCreator {
  constructor(linkUrl) {
    this.walletLinkUrl = linkUrl || 'connect-MEWconnect';
    this.sessionId = '';
    this.sessionId = false;
    this.logo = logo;
  }

  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  get window(){
    return this.popupWindow;
  }


  hideNotifier() {
    const notify = document.getElementById('Notifications');
    notify.className = 'hidden';
  }

  showPopupWindow(qrcode) {
    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
      return this.popupWindow;
    }

    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }
    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    const width = 320;
    const height = 520;
    const left = Math.floor(window.outerWidth / 2 - width / 2 + window.screenX);
    const top = Math.floor(window.outerHeight / 2 - height / 2 + window.screenY);
    this.popupUrl = popupUrl;
    this.popupWindow = window.open(
      '',
      'windowName',
      [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'location=0',
        'menubar=0',
        'resizable=0',
        'status=0',
        'titlebar=0',
        'toolbar=0'
      ].join(',')
    );
    this.popupWindow.document.write(htmlDesign);
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });


    const css = this.popupWindow.document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = cssStyles;
    else
      css.innerText = cssStyles;
    this.popupWindow.document.body.appendChild(css);

    this.popupWindow.addEventListener('beforeunload', () => {
      this.hideNotifier();
    });

    return this.popupWindow;
  }

  closePopupWindow() {
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