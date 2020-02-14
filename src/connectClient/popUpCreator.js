import QrCode from 'qrcode';
import logo from './logoImage';
import {cssStyles, htmlDesign, noticetext, windowInformer} from './popupWindowDesign'

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

  createWindowInformer() {

    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = noticetext;
    else
      css.innerText = noticetext;
    document.body.appendChild(css);
    const div = window.document.createElement('div');
    div.id = 'Notifications';
    div.className = 'hidden';

    div.innerHTML = windowInformer;
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
      this.hideNotifier();
      this.closePopupWindow();
    });
  }

  showPopupWindow(qrcode) {
    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
      return this.popupWindow;
    }
    console.log('showPopupWindow'); // todo remove dev item
    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }

    this.createWindowInformer();
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
    this.popupWindow.document.write(htmlDesign(this.logo));
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });


    const css = this.popupWindow.document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = cssStyles;
    else
      css.innerText = cssStyles;
    this.popupWindow.document.body.appendChild(css);

    this.showWindowInformer();
    this.popupWindow.addEventListener('beforeunload', () => {
      this.hideNotifier();
      this.popupWindow = null;
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