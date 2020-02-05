import QrCode from 'qrcode';

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
import logo from './logo.svg';
import { popUpStyles, noticetext, innerHTML } from './popupStyles';
import cssStyles from './windowStyles';

export default class PopUpHandler {
  constructor(linkUrl) {
    this.walletLinkUrl = linkUrl || 'connect-MEWconnect';
    this.sessionId = '';
    this.sessionId = false;
    this.index = 0;
    this.checkCount = 0;
    this.elementId = 'mew-connect-notice';
    this.initialcheckIfIdExists();
    this.createCss();
    this.createNotice();
    this.createWindowInformer();
    this.styleDefaults = {};
  }

  initialcheckIfIdExists() {
    const element = window.document.getElementById(this.elementId);
    if (element) {
      this.checkCount++;
      this.elementId = this.elementId + `-${this.checkCount}`;
      this.initialcheckIfIdExists();
    }
  }

  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  showNotice(text, styleOverrides) {
    if (!text) {
      text = 'Check your phone to continue';
    }

    const element = window.document.getElementById(this.elementId);
    if (styleOverrides) {
      for (const key in styleOverrides) {
        this.styleDefaults[key] = element.style[key];
        element.style[key] = styleOverrides[key];
      }
    } else {
      for (const key in this.styleDefaults) {
        element.style[key] = this.styleDefaults[key];
      }
    }
    element.className = 'show';

    const elementText = window.document.getElementById(`${this.elementId}-text`);
    elementText.innerHTML = text;

    setTimeout(function() { element.className = element.className.replace('show', ''); }, 3800);
  }

  createNotice() {
    console.log('showPopupWindow'); // todo remove dev item
    console.log('open?'); // todo remove dev item
    this.index++;

    const div = window.document.createElement('div');
    div.id = this.elementId;
    const img = window.document.createElement('img');
    img.src = logo;
    img.id = this.elementId + '-img';
    div.appendChild(img);
    const textDiv = window.document.createElement('div');
    textDiv.id = this.elementId + '-text';
    div.appendChild(textDiv);
    // const link = window.document.createElement('a');
    // link.className = 'hidden'
    // link.id = this.elementId + '-link';
    // div.appendChild(link)
    window.document.body.appendChild(div);
  }

  createCss() {
    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = popUpStyles(this.elementId);
    else
      css.innerText = popUpStyles(this.elementId);
    document.body.appendChild(css);
  }

  createWindowInformer() {
    console.log('createWindowInformer'); // todo remove dev item
    console.log('open?'); // todo remove dev item
    this.index++;

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

    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
      console.log('returning 1'); // todo remove dev item
      return this.popupWindow;
    }
    if (!qrcode) {
      throw Error('No connection string supplied to popup window');
    }
    this.showWindowInformer();

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
             <img src="${logo}"/>
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
    this.popupWindow.addEventListener('beforeunload', () => {
      this.hideNotifier();
    });
    console.log('returning 2'); // todo remove dev item
    return this.popupWindow;
  }

  closePopupWindow() {
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupUrl = null;
      this.popupWindow = null;
      console.log(this.popupWindow); // todo remove dev item
    }
    window.focus();
  }

  handleBeforeUnload(_evt) {
    this.closePopupWindow();
  }
}