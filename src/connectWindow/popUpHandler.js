import { notifierCSS, connectedNotifierCSS } from './popupStyles';
import { noticeHtml, connectedNoticeHtml } from './popupHtml';
import { spaceman, closeIconBlack, closeIconWhite } from './images/index';
import { getMessage } from './messageCreator';
// import debugLogger from 'debug';

// TODO add debug logging
// const debug = debugLogger('MEWconnect:popup-handler');


export default class PopUpHandler {
  constructor() {
    this.index = 0;
    this.checkCount = 0;
    this.elementId = 'mew-connect-notice-corner';
    this.connectedElementId = this.elementId + '-connected';
    this.initialcheckIfIdExists();
    this.createNotice();
    this.timeoutTracker = null;
    this.lastActiveElement = '';
    this.connectNoticeVisible = false;
  }

  initialcheckIfIdExists() {
    const element = window.document.getElementById(this.elementId);
    if (element) {
      this.checkCount++;
      this.elementId = this.elementId + `-${this.checkCount}`;
      this.connectedElementId = this.elementId + '-connected';
      this.initialcheckIfIdExists();
    }
  }

  showNotice(text, overrides = null) {
    let timeoutTime = 3800;
    let timeoutOverride = false;
    if (typeof text === 'object') {
      text = getMessage(null, text);
    } else {
      text = getMessage(text);
    }
    if (!text) {
      text = 'Check your phone to continue';
    }

    if (typeof overrides === 'number') {
      timeoutTime = overrides;
      timeoutOverride = true;
    }

    const element = window.document.getElementById(this.elementId);
    this.lastActiveElement = element;
    if (!timeoutOverride) {
      element.className = 'show';

      const elementText = window.document.getElementById(
        `${this.elementId}-text`
      );
      elementText.innerHTML = text;

      setTimeout(function() {
        element.className = element.className.replace('show', '');
      }, timeoutTime);
    } else {
      element.className = 'show-in';

      const elementText = window.document.getElementById(
        `${this.elementId}-text`
      );
      elementText.innerHTML = text;

      setTimeout(function() {
        element.className = element.className.replace('show-in', 'show-out');
      }, timeoutTime - 500);
      this.timeoutTracker = setTimeout(function() {
        element.className = element.className.replace('show-out', '');
      }, timeoutTime);
    }
  }

  showConnectedNotice(text, overrides) {
    let timeoutTime = 3800;
    let timeoutOverride = false;

    if (typeof overrides === 'number') {
      timeoutTime = overrides;
      timeoutOverride = true;
    }
    const element = window.document.getElementById(this.connectedElementId);
    this.lastActiveElement = element;
    if (!timeoutOverride) {
      element.className = 'show';

      setTimeout(function() {
        element.className = element.className.replace('show', '');
        this.connectNoticeVisible = true;
      }, timeoutTime);
    } else {
      element.className = 'show-in';

      setTimeout(function() {
        element.className = element.className.replace('show-in', 'show-out');
        this.connectNoticeVisible = true;
      }, timeoutTime - 500);
      this.timeoutTracker = setTimeout(function() {
        element.className = element.className.replace('show-out', '');
        this.connectNoticeVisible = false;
        this.lastActiveElement = null;
      }, timeoutTime);
    }
  }

  showNoticePersistentEnter(text) {
    if (typeof text === 'object') {
      text = getMessage(null, text);
    } else {
      text = getMessage(text);
    }

    const element = window.document.getElementById(this.elementId);

    element.className = 'show-persistent';

    const elementText = window.document.getElementById(
      `${this.elementId}-text`
    );
    elementText.innerHTML = text;

    this.timeoutTracker = setTimeout(function() {
      element.className = element.className.replace('show-persistent', '');
    }, 10800);
  }

  showNoticePersistentExit() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
      const element = window.document.getElementById(this.elementId);
      element.className = element.className.replace(
        'show-persistent',
        'show-persistent-leave'
      );

      this.timeoutTracker = setTimeout(function() {
        element.className = element.className.replace(
          'show-persistent-leave',
          ''
        );
      }, 1800);
    }
  }

  noShow() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    const element = window.document.getElementById(this.elementId);
    element.className = '';
  }

  createNotice() {
    this.index++;

    const div = window.document.createElement('div');
    div.id = this.elementId;
    div.innerHTML = noticeHtml(this.elementId, spaceman, closeIconBlack);
    window.document.body.appendChild(div);

    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = notifierCSS(this.elementId);
    else css.innerText = notifierCSS(this.elementId);
    document.body.appendChild(css);

    const closeEl = document.getElementById(this.elementId + '-close');
    closeEl.addEventListener('click', () => {
      const el = document.getElementById(this.elementId);
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }
      el.className = el.className.replace('show', '');
    });

    // create connected notice
    const divConn = window.document.createElement('div');
    divConn.id = this.connectedElementId;
    divConn.innerHTML = connectedNoticeHtml(
      this.connectedElementId,
      spaceman,
      closeIconWhite
    );
    window.document.body.appendChild(divConn);

    const cssConn = document.createElement('style');
    cssConn.type = 'text/css';
    if ('textContent' in cssConn)
      cssConn.textContent = connectedNotifierCSS(this.connectedElementId);
    else cssConn.innerText = connectedNotifierCSS(this.connectedElementId);
    document.body.appendChild(cssConn);

    const closeElConn = document.getElementById(
      this.connectedElementId + '-close'
    );
    closeElConn.addEventListener('click', () => {
      const el = document.getElementById(this.connectedElementId);
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }
      el.className = el.className.replace('show', '');
    });
  }

  hideNotifier() {
    const notify = document.getElementById('Notifications');
    if (notify) {
      notify.className = 'hidden';
    }
  }
}
