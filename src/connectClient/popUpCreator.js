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

export default class PopUpCreator {
  constructor(linkUrl) {
    this.walletLinkUrl = linkUrl || 'connect-MEWconnect';
    this.sessionId = '';
    this.sessionId = false;
  }


  openPopupWindow(text) {
    this.showPopupWindow(text);
  }

  showPopupWindow(qrcode) {
    console.log('showPopupWindow'); // todo remove dev item
    if(!qrcode){
      throw Error("No connection string supplied to popup window")
    }
    console.log('open?'); // todo remove dev item
    const popupUrl = `${this.walletLinkUrl}/#MEWconnect`;

    if (this.popupWindow && this.popupWindow.opener) {
      if (this.popupUrl !== popupUrl) {
        this.popupWindow.location.href = popupUrl;
        this.popupUrl = popupUrl;
      }
      this.popupWindow.focus();
      return;
    }

    const width = 320;
    const height = 520;
    const left = Math.floor(window.outerWidth / 2 - width / 2 + window.screenX);
    const top = Math.floor(window.outerHeight / 2 - height / 2 + window.screenY);
    this.popupUrl = popupUrl;
    this.popupWindow = window.open(
      popupUrl,
      '_blank',
      [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'location=yes',
        'menubar=no',
        'resizable=no',
        'status=no',
        'titlebar=yes',
        'toolbar=no'
      ].join(',')
    );

    this.popupWindow.document.write('<body><canvas id="canvas"></canvas></body>');
    // const cssText = `/* The snackbar - position it at the bottom and in the middle of the screen */
    //     #${this.elementId}-img {
    //       height: 25%;
    //       width: 75%;
    //     }
    //
    //     .hidden {
    //       visibility: hidden;
    //     }
    //
    //     .shown {
    //       visibility: visible;
    //     }
    //
    //     #${this.elementId} {
    //       visibility: hidden; /* Hidden by default. Visible on click */
    //       min-width: 250px; /* Set a default minimum width */
    //       margin-left: -125px; /* Divide value of min-width by 2 */
    //       background-color: rgba(226, 226, 226, 0.2);
    //       color: #000000; /* White text color */
    //       text-align: center; /* Centered text */
    //       border-radius: 2px; /* Rounded borders */
    //       padding: 16px; /* Padding */
    //       position: fixed; /* Sit on top of the screen */
    //       z-index: 1; /* Add a z-index if needed */
    //       right: 30px; /* Center the snackbar */
    //       top: 30px; /* 30px from the bottom */
    //     }
    //
    //     /* Show the snackbar when clicking on a button (class added with JavaScript) */
    //     #${this.elementId}.show {
    //       visibility: visible; /* Show the snackbar */
    //       /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    //       However, delay the fade out process for 2.5 seconds */
    //       -webkit-animation: fadein-${this.elementId} 0.5s, fadeout-${this.elementId} 0.5s 2.5s;
    //       animation: fadein-${this.elementId} 0.5s, fadeout-${this.elementId} 0.5s 2.5s;
    //     }
    //
    //     /* Animations to fade the snackbar in and out */
    //     @-webkit-keyframes fadein-${this.elementId} {
    //       from {top: 0; opacity: 0;}
    //       to {top: 30px; opacity: 1;}
    //     }
    //
    //     @keyframes fadein-${this.elementId} {
    //       from {top: 0; opacity: 0;}
    //       to {top: 30px; opacity: 1;}
    //     }
    //
    //     @-webkit-keyframes fadeout-${this.elementId} {
    //       from {top: 30px; opacity: 1;}
    //       to {top: 0; opacity: 0;}
    //     }
    //
    //     @keyframes fadeout-${this.elementId} {
    //       from {top: 30px; opacity: 1;}
    //       to {top: 0; opacity: 0;}
    //     }`;
    // const css = document.createElement('style');
    // css.type = 'text/css';
    // if ('textContent' in css)
    //   css.textContent = cssText;
    // else
    //   css.innerText = cssText;
    // document.body.appendChild(css);
    const element = this.popupWindow.document.getElementById('canvas');
    QrCode.toCanvas(element, qrcode);
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