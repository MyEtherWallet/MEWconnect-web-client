import { notifierCSS } from './popupStyles';
import { noticeHtml } from './popupHtml';
import { logo } from './images/index';

// import debugLogger from 'debug';

// TODO add debug logging
// const debug = debugLogger('MEWconnect:popup-handler');

export default class PopUpHandler {
  constructor() {
    this.index = 0;
    this.checkCount = 0;
    this.elementId = 'mew-connect-notice';
    this.initialcheckIfIdExists();
    this.createNotice();
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

  createNotice() {
    this.index++;

    const div = window.document.createElement('div');
    div.id = this.elementId;
    div.innerHTML = noticeHtml(this.elementId, logo);
    window.document.body.appendChild(div);

    const css = document.createElement('style');
    css.type = 'text/css';
    if ('textContent' in css) css.textContent = notifierCSS(this.elementId);
    else css.innerText = notifierCSS(this.elementId);
    document.body.appendChild(css);

    const closeEl = document.getElementById(this.elementId + '-close');
    closeEl.addEventListener('click', event => {
      const el = document.getElementById(this.elementId);
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
