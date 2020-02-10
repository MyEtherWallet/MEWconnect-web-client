import QrCode from 'qrcode';
import logo from '../connectProvider/logoImage';
import cssStyles from './popupStyles'
import { noticetext } from '../connectProvider/popupStyles';

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
    this.logo = logo;
    // this.createWindowNotifier();
  }

  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  get window(){
    return this.popupWindow;
  }

  createWindowNotifier() {
    console.log('createWindowInformer'); // todo remove dev item
    console.log('open?'); // todo remove dev item

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
    // div.style="visibility: hidden;"

    div.innerHTML = `    <div class="Notification Notificationshow NotificationExpand">
      <div class="NotificationBox">
        <div class="NotificationContent">
          <div class="NotificationMessage">Requesting to connect to your wallet...</div>
        </div>
        <div class="NotificationProgressBar"></div>
        <div class="NotificationActions">
          <div class="NotificationAction"><span
            class="NotificationButtonInfo NotificationButtonInfo1">Don’t see the popup?</span>
            <button id="NotificationButton1" class="NotificationButton NotificationButton1">Show
                                                                   window
            </button>
          </div>
          <div class="NotificationAction"><span
            class="NotificationButtonInfo NotificationButtonInfo2">Made a mistake?</span>
            <button id="NotificationButton2" class="NotificationButton NotificationButton2">Cancel
            </button>
          </div>
        </div>
      </div>
    </div>`;
    window.document.body.appendChild(div);
  }

  hideNotifier() {
    const notify = document.getElementById('Notifications');
    notify.className = 'hidden';
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
    console.log('showPopupWindow'); // todo remove dev item


    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
      console.log('returning 1'); // todo remove dev item
      return this.popupWindow;
    }

    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }
    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    // this.showWindowInformer();

    const width = 320;
    const height = 520;
    const left = Math.floor(window.outerWidth / 2 - width / 2 + window.screenX);
    const top = Math.floor(window.outerHeight / 2 - height / 2 + window.screenY);
    this.popupUrl = popupUrl;
    console.log(this.popupUrl); // todo remove dev item
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
    this.popupWindow.document.write(`
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        <meta name="theme-color" content="#000000"/>
        <title>MEWconnect</title>
      </head>

        <body>
          <div class="outer-container">
            <div class="container">
            <h3 class="text-one">Scan QR Code</h3>
            <h4 class="text-two">To connect mobile wallet</h4>
            <div class="qr-code">
              <canvas id="canvas"></canvas>
            </div>
              <ol class="list-style">
                <li>Open compatible wallet app</li>
                <li>Find and open the QR scanner</li>
                <li>Scan this QR code</li>
              </ol>
            </div>
            <div class="bottom-container">
            
            <h5 class="bottom-container-text">Powered by</h5>
             <img src="${this.logo}"/>
           </div>
          </div>
        </body>
      </html>`);
    //<h5 class="bottom-container-text">Powered by MEWconnect</h5>
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });


    const css = this.popupWindow.document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = cssStyles;
    else
      css.innerText = cssStyles;
    this.popupWindow.document.body.appendChild(css);
    console.log(this.popupWindow); // todo remove dev item
    console.log(window); // todo remove dev item
    console.log('returning 2'); // todo remove dev item

    this.popupWindow.addEventListener('beforeunload', () => {
      this.hideNotifier();
    });

    return this.popupWindow;
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