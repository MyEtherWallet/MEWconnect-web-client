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
import logo from './logoImage';
import { notifierCSS, WindowInformerCSS } from './popupStyles';
import { windowPopup, windowInformer, noticeHtml } from './popupHtml';
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
    this.createNotice();
    this.createWindowInformer();
    this.styleDefaults = {};
    this.timeoutTracker = null;
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
    let timeoutTime = 3800;
    let timeoutOverride = false;
    if (!text) {
      text = 'Check your phone to continue';
    }

    if (typeof styleOverrides === 'number') {
      timeoutTime = styleOverrides;
      timeoutOverride = true;
    }
    const element = window.document.getElementById(this.elementId);

    if (styleOverrides && typeof styleOverrides === 'object') {
      for (const key in styleOverrides) {
        this.styleDefaults[key] = element.style[key];
        element.style[key] = styleOverrides[key];
      }
    } else {
      for (const key in this.styleDefaults) {
        element.style[key] = this.styleDefaults[key];
      }
    }

    if (!timeoutOverride) {
      element.className = 'show';

      const elementText = window.document.getElementById(`${this.elementId}-text`);
      elementText.innerHTML = text;

      setTimeout(function() { element.className = element.className.replace('show', ''); }, timeoutTime);
    } else {
      element.className = 'show-in';

      const elementText = window.document.getElementById(`${this.elementId}-text`);
      elementText.innerHTML = text;

      setTimeout(function() { element.className = element.className.replace('show-in', 'show-out'); }, timeoutTime - 500);
      this.timeoutTracker = setTimeout(function() { element.className = element.className.replace('show-out', ''); }, timeoutTime);
    }
  }

  showNoticePersistentEnter(text, styleOverrides) {
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

    element.className = 'show-persistent';

    const elementText = window.document.getElementById(`${this.elementId}-text`);
    elementText.innerHTML = text;

    this.timeoutTracker = setTimeout(function() { element.className = element.className.replace('show-persistent', ''); }, 10800);
  }

  showNoticePersistentExit() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
      const element = window.document.getElementById(this.elementId);
      element.className = element.className.replace('show-persistent', 'show-persistent-leave');

      this.timeoutTracker = setTimeout(function() { element.className = element.className.replace('show-persistent-leave', ''); }, 1800);
    }
  }

  createNotice() {
    this.index++;

    const div = window.document.createElement('div');
    div.id = this.elementId;
    div.innerHTML = noticeHtml(this.elementId, logo);
    // const divClose = window.document.createElement('div');
    // divClose.id = this.elementId + 'close';
    // divClose.textContent = 'X';
    // div.appendChild(divClose);
    // const img = window.document.createElement('img');
    // img.src = logo;
    // img.id = this.elementId + '-img';
    // div.appendChild(img);
    // const textDiv = window.document.createElement('div');
    // textDiv.id = this.elementId + '-text';
    // div.appendChild(textDiv);
    window.document.body.appendChild(div);

    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = notifierCSS(this.elementId);
    else
      css.innerText = notifierCSS(this.elementId);
    document.body.appendChild(css);

    const closeEl = document.getElementById(this.elementId + '-close');
    closeEl.addEventListener('click', (event) => {
      const el = document.getElementById(this.elementId);
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }
      el.className = el.className.replace('show', '');
    });
  }

  createWindowInformer() {
    this.index++;

    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = WindowInformerCSS;
    else
      css.innerText = WindowInformerCSS;
    document.body.appendChild(css);
    const div = window.document.createElement('div');
    div.id = 'Notifications';
    div.className = 'hidden';

    div.innerHTML = windowInformer;
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
    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    if (this.popupWindow && this.popupWindow.opener) {
      this.popupWindow.focus();
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

    this.popupWindow.document.write(windowPopup(logo));
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode, { errorCorrectionLevel: 'H', width: 200 });

    const css = this.popupWindow.document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css)
      css.textContent = cssStyles;
    else
      css.innerText = cssStyles;
    this.popupWindow.document.body.appendChild(css);
    this.popupWindow.addEventListener('onbeforeunload', () => {
      this.hideNotifier();
    });
    const popupwindow = this.popupWindow;
    window.addEventListener('onbeforeunload', () => {
      popupwindow.close();
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