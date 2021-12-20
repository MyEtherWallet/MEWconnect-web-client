const cssStyles = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

      .outer-container-mew-modal {
        font-family: 'Roboto', sans-serif;
        box-sizing: border-box;
        bottom: 0;
        color: #050f19;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        left: 0;
        position: absolute;
        right: 0;
        text-align: center;
        top: 0;
        min-width: 450px;
        max-width: 450px;
        max-height: 558px;
      }
      
      .container-mew-modal {
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        text-align: center;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        flex-shrink: 0;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 16px;
        padding-top: 16px;
        position: relative;
        max-width: 450px;
        max-height: 404px;
        width: 100%;
        top: 0;
      }
      
      .upper-text {
        position: relative;
        left: 0;
        bottom: 15px;
      }
      
     .close-mew-modal{
        position: absolute;
        padding-top: 10px;
        right: 10px !important;
        top: 0;
        width: 20px;
        cursor: pointer;
        z-index: 10;
      }
      
      .mew-qr-code {
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        height: 210px;
        width: 210px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        box-sizing: border-box;
        background-color: white;
        border-radius: 8px;
        display: inline-block;
      }
      .mew-text-one {
        min-width: 380px;
        height: 30px;
        color: rgba(0, 0, 0);
        font-size: 24px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        text-align: center;
        letter-spacing: 0.3px;
        line-height: 30px;
        box-sizing: border-box;
        padding-bottom: 8px;
      }
      .mew-text-two {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.55);
        font-weight: normal;
        height: 16px;
        letter-spacing: 0.17px;
        text-align: center;
        min-width: 265px;
        padding-top: 8px;
      }
      .mew-list-style {
        width: 278px;
        height: 48px;
        color: rgba(0, 0, 0, 0.55);
        font-size: 12px;
        font-family: 'Roboto', sans-serif;
        font-weight: normal;
        letter-spacing: 0.15px;
        line-height: 16px;
        margin-left: 20px;
        list-style-position: outside;
        text-align: left;
        position: relative;
        left: 30px
      }
      .mew-list-style li {
        margin-left: 0;
        padding-left: 10px;
      }
      .mew-bottom-background {
        position: absolute;
        bottom: 0;
        right: 64px;
        border-radius: 0 0 16px 16px;
        background: rgb(249, 250, 251);
        text-align: center;
        padding-top: 25px;
        padding-bottom: 15px;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }
      .bottom-container-mew-modal {
        position: relative;
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 16px;
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
        justify-content: center;
        left: -15px;
        
      }

      .bottom-container-mew-modal > .left {
        margin-right: 15px;
      }

      .bottom-container-mew-modal > .center {
        margin-right: 15px;
      }

      .bottom-container-mew-modal > .right {
        align-items: flex-start;
        text-align: left;
      }

      .bottom-container-mew-modal > .left-img {
        padding-right: 10px;
      }

      .bottom-container-mew-modal-text {
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        box-sizing: border-box;
        font-size: 13px;
        margin: 0;
        opacity: 0.5;
        text-align: left;
      }
      .bottom-container-mew-modal-text-old {
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        box-sizing: border-box;
        font-size: 13px;
        margin: 0;
        opacity: 0.5;
        padding: 16px;
        text-align: center;
      }

      .spaceman-background {
        background-color: white;
        border-radius: 10px;
      }

      p {
        margin: 0;
        padding-bottom: 5px;
      }

      .mew-bottom {
        color: rgba(0, 0, 0, 0.55);
        font-size: 12px;
        font-family: 'Roboto', sans-serif;
        font-weight: lighter;
        letter-spacing: 0.15px;
      }
      
      .bottom-link {
      text-decoration: none;
       color: rgba(5, 192, 165);
       cursor: pointer;
      }
      
      #refresh-container-mew-modal {
      background: #33c7b0;
      border-radius: 5px;
      padding: 5px;
      }
      
      #refresh-container-mew-modal:hover {
      background: #238677;
      }

      .refreshIcon {
        padding-top: 5px;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        cursor: pointer;
        color: #fffff;
      }

      .mew-hidden {
        display: none;
      }
      
      .mew-get-text {
        width: 265px;
        height: 16px;
        color: rgb(0, 0, 0);
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        font-weight: normal;
        letter-spacing: 0.17px;
      }
      
      .mew-camera-icon {
          opacity: 0.54;
          position: relative;
          bottom: -2px;
          height: 14px;
          width: 14px;
        }
        
        #mew-google-link:hover {
        cursor: pointer;
        }
        
        #mew-apple-link:hover {
        cursor: pointer;
        }
        
        .mew-warn-color {
        color: orange;
        }
        
        .loader-mew,
        .loader-mew:after {
          border-radius: 50%;
          width: 10em;
          height: 10em;
        }
        .loader-mew {
          margin: 20px auto;
          font-size: 10px;
          position: relative;
          text-indent: -9999em;
          border-top: 1em solid rgba(166,183,183, 0.2);
          border-right: 1em solid rgba(166,183,183, 0.2);
          border-bottom: 1em solid rgba(166,183,183, 0.2);
          border-left: 1em solid rgba(8, 165, 178, 1);
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-animation: load8 1.1s infinite linear;
          animation: load8 1.1s infinite linear;
        }
        @-webkit-keyframes load8 {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes load8 {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
    `;

const htmlDesign = (
  refresh,
  image,
  playStore,
  appStore,
  camera,
  iconImage,
  iosLink,
  androidLink
) => {
  return `
    <div class="outer-container-mew-modal">
      <div class="container-mew-modal">
              <div class="close-mew-modal" id="close-mew-modal" aria-label="close modal" data-close>
          <img src="${iconImage}" height="17" width="11"/>
        </div>
      <div class="upper-text">

        <p class="mew-text-one">Connect to MEW&nbsp;wallet app</p>
        <p class="mew-text-two">Scan this code to connect</p>
       </div>
        <div id="qr-failure"></div>
        <div id="qr-code-connecting-mew" class="mew-hidden"><div class="loader-mew"></div><h4>Connecting...</h4> Creating encrypted peer-to-peer connection </div>
        <div id="qr-code-display-container-mew" class="mew-qr-code">
          <canvas id="canvas-for-mewconnect-qr-code"></canvas>
        </div>
        <div id="refresh-container" class="refreshIcon mew-hidden">
          Try Again <img id="refresh" src="${refresh}" />
        </div>

        <ol class="mew-list-style">
          <li>Open MEW wallet app on your mobile device</li>
          <li class="with-image">Click <img class="mew-camera-icon" src="${camera}"> icon in the top right corner</li>
          <li>Scan this code to connect</li>
        </ol>
      </div>
      <div class="mew-bottom-background">
        <div class="bottom-container-mew-modal">
          <div class="left">
            <img
              class="spaceman-background"
              src="${image}"
              height="58"
              width="58"
            />
          </div>
          <div class="center">
            <div class="right">
              <p class="mew-get-text">Don't have MEW&nbsp;wallet app?</p>
              <p id="popupsBlocked" class="mew-warn-color"></p>
                      <a href="${iosLink}" target="_blank" id="appStore">               <img
                  id="mew-apple-link"
                  class="left-img"
                  src="${appStore}"
                  height="40"
                  width="120"
                /></a>

                      <a href="${androidLink}" target="_blank" id="playStore">                <img
                  id="mew-google-link"
                  src="${playStore}"
                  height="40"
                  width="135"
                /></a>



            </div>
          </div>

        </div>
        <div class="mew-bottom">
          Powered by <a href="https://myetherwallet.github.io/MEWconnect-Protocol-Documentation/" target="_blank" id="proto-link" class="bottom-link">MEWconnect protocol</a> <br />
          brought to you by <a href="https://www.myetherwallet.com/" target="_blank" id="mew-link" class="bottom-link">MyEtherWallet</a>
        </div>
      </div>
    </div>

`;
};

const noticetext = `

      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');


      div#Notifications.mew-hidden {
        visibility: hidden;
      }
      
      div#Notifications.mew-hidden {
        visibility: hidden;
      }

      div#qrcodeError.shown {
        visibility: visible;
      }
      
      div#qrcodeError.mew-hidden {
        visibility: hidden;
      }
      div#retry-button-mew.mew-hidden {
        display: none;
      }

      #Notifications,
      #Notifications * {

        animation: none;
        animation-delay: 0;
        animation-direction: normal;
        animation-duration: 0;
        animation-fill-mode: none;
        animation-iteration-count: 1;
        animation-name: none;
        animation-play-state: running;
        animation-timing-function: ease;
        backface-visibility: visible;
        background: 0;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: transparent;
        background-image: none;
        background-origin: padding-box;
        background-position: 0 0;
        background-position-x: 0;
        background-position-y: 0;
        background-repeat: repeat;
        background-size: auto auto;
        border-collapse: separate;
        border-image: none;
        border-spacing: 0;
        border-radius: 0;
        border: medium none inherit;
        bottom: auto;
        box-shadow: none;
        box-sizing: border-box;
        caption-side: top;
        clear: none;
        clip: auto;
        color: inherit;
        columns: auto;
        column-count: auto;
        column-fill: balance;
        column-gap: normal;
        column-rule: medium none currentColor;
        column-rule-color: currentColor;
        column-rule-style: none;
        column-span: 1;
        column-width: auto;
        content: normal;
        counter-increment: none;
        counter-reset: none;
        cursor: auto;
        direction: ltr;
        display: inline;
        empty-cells: show;
        float: none;
        font-family: 'Roboto', sans-serif;
        font-size: medium;
        font-style: normal;
        font-variant: normal;
        font-weight: normal;
        height: auto;
        hyphens: none;
        left: auto;
        letter-spacing: normal;
        line-height: normal;
        list-style: disc outside none;
        margin: 0;
        max-height: none;
        max-width: none;
        min-height: 0;
        min-width: 0;
        opacity: 1;
        orphans: 0;
        outline: invert none medium;
        overflow: visible;
        overflow-x: visible;
        overflow-y: visible;
        padding: 0;
        page-break-after: auto;
        page-break-before: auto;
        page-break-inside: auto;
        perspective: none;
        perspective-origin: 50% 50%;
        pointer-events: auto;
        position: static;
        quotes: "\\201C" "\\201D" "\\2018" "\\2019";
        right: auto;
        tab-size: 8;
        table-layout: auto;
        text-align: inherit;
        text-align-last: auto;
        text-decoration: none;
        text-decoration-color: inherit;
        text-decoration-line: none;
        text-decoration-style: solid;
        text-indent: 0;
        text-shadow: none;
        text-transform: none;
        top: auto;
        transform: none;
        transform-style: flat;
        transition: none;
        transition-delay: 0s;
        transition-duration: 0s;
        transition-property: none;
        transition-timing-function: ease;
        unicode-bidi: normal;
        vertical-align: baseline;
        white-space: normal;
        widows: 0;
        width: auto;
        word-spacing: normal;
        z-index: 9999999999;
        all: initial;
        all: unset;

      }

      #Notifications * {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        box-sizing: border-box;
      }

      #Notifications {
        position: fixed;
        top: 0;
        right: 0;
        text-align: right;
        z-index: 2147483647;
      }

      #Notifications style {
        display: none;
      }

      #Notifications .Notification {
        display: block;
        margin: 8px 16px 0 16px;
      }

      #Notifications .NotificationBox {
        display: flex;
        flex-direction: column;
        background-color: #fff;
        color: black;
        margin: 0;
        font-size: 14px;
        box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 0px 8px rgba(0, 0, 0, 0.04);
        border-radius: 16px;
        transition: opacity 0.25s, transform 0.25s;
        opacity: 0;
        transform: translateX(25%);
        text-align: left;
        overflow: hidden;
      }

      #Notifications
      .Notificationshow
      .NotificationBox {
        opacity: 1;
        transform: translateX(0);
      }

      #Notifications .NotificationContent {
        background-color: rgb(249, 250, 251);
        display: flex;
        flex-direction: row;
        padding: 8px 8px 8px 16px;
        align-items: center;
        user-select: none;
        cursor: pointer;
      }

      #Notifications .NotificationMessage {
        display: block;
        color: black;
        line-height: 1.5;
      }

      #Notifications .NotificationChevron {
        display: block;
        margin-left: 8px;
        transition: transform 0.05s;
      }

      #Notifications .NotificationProgressBar {
        display: block;
        height: 2px;
        position: relative;
      }

      #Notifications .NotificationProgressBar::before {
        display: block;
        position: absolute;
        content: "";
        left: -100%;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
          to right,
          rgba(22, 82, 240, 0) 0%,
          rgba(51, 199, 176, 1) 100%
        );
        animation: MewNotificationProgressBar 2s linear infinite;
      }

      @keyframes MewNotificationProgressBar {
        0% {
          left: 0;
          width: 0%;
          background-image: linear-gradient(
            to right,
            rgba(22, 82, 240, 0) 0%,
            rgba(51, 199, 176, 1) 100%
          );
        }
        25% {
          left: 0;
          width: 100%;
        }
        50% {
          left: 100%;
          width: 0%;
          background-image: linear-gradient(
            to right,
            rgba(22, 82, 240, 0) 0%,
            rgba(51, 199, 176, 1) 100%
          );
        }
        50.01% {
          background-image: linear-gradient(
            to left,
            rgba(22, 82, 240, 0) 0%,
            rgba(51, 199, 176, 1) 100%
          );
        }
        75% {
          left: 0;
          width: 100%;
        }
        100% {
          left: 0;
          width: 0%;
          background-image: linear-gradient(
            to left,
            rgba(22, 82, 240, 0) 0%,
            rgba(51, 199, 176, 1) 100%
          );
        }
      }

      #Notifications
      .NotificationExpand
      .NotificationProgressBar {
        margin-bottom: -1px;
      }

      #Notifications
      .NotificationExpand
      .NotificationChevron {
        transform: rotateZ(180deg);
      }

      #Notifications .NotificationActions {
        display: none;
        flex-direction: column;
        border-top: 1px solid #f5f7f8;
        padding: 8px 16px;
      }

      #Notifications
      .NotificationExpand
      .NotificationActions {
        display: flex;
      }

      #Notifications .NotificationAction {
        color: #888;
        margin: 8px 0;
      }

      #Notifications .NotificationButtonInfo {
        margin: 0 8px 0 0;
      }

      #Notifications .NotificationButton {
        color: #33c7b0;
        -webkit-text-fill-color: #33c7b0;
        cursor: pointer;
        display: inline;
        margin: 0;
        padding: 0;
        -webkit-appearance: none;
        transition: opacity 0.25s;
      }

      #Notifications .NotificationButton:active {
        opacity: 0.6;
      }

      #Notifications .NotificationContent .spaceman-background {
        background-color: rgb(249, 250, 251);
        border-radius: 10px;
        height: 50px;
        width: 50px;
      }
      `;

const windowInformer = spaceman => {
  return `
      <div class="Notification Notificationshow NotificationExpand">
        <div class="NotificationBox">
          <div class="NotificationContent">
            <img
              class="spaceman-background"
              src="${spaceman}"
            />
            <div class="NotificationMessage">Requesting to connect using MEW wallet</div>
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
            <div id="retry-button-mew" class="NotificationAction mew-hidden"><span
              class="NotificationButtonInfo NotificationButtonInfo2">Refresh QRcode and </span>
              <button id="NotificationButton3" class="NotificationButton NotificationButton2">Try Again
              </button>
            </div>
              <div id="qrcodeError" class="NotificationError mew-hidden"><span
              class="NotificationButtonInfo NotificationButtonInfo2">Failed to generate QR code. Please cancel and retry.</span>
            </div>
          </div>
        </div>
      </div>
`;
};

const modalFrame = innerContent => {
  return `
    <div class="mew-wallet-modal is-visible" id="mew-wallet-modal"></div>
    <div class="mew-wallet-modal-container-mew-modal is-visible" id="mew-wallet-modal-container">
      <div class="mew-wallet-modal-dialog is-visible" id="mew-mobile-modal-dialog">
        <section class="mew-wallet-modal-content">
        ${innerContent}
        </section>
      </div>
    </div>
`;
};

const modalCSS = (additionalCss = '') => {
  return `
${additionalCss}

      #mew-mobile-modal-dialog section.mew-wallet-modal-content{
        position: fixed;
        min-width: 448px;
        max-width: 448px;
        min-height: 558px;
        max-height: 558px;
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
            
      .mew-wallet-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: black;
        cursor: default;
        visibility: hidden;
        opacity: 0;
        transition: all 0.35s ease-in;
      }

      .mew-wallet-modal.is-visible {
        visibility: visible;
        opacity: 0.25;
        z-index: 999999;
      }

      div.mew-wallet-modal-dialog {
        position: fixed;
        background: rgb(255, 255, 255);
        border-radius: 16px;
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05),
        0px 3px 6px 0px rgba(0, 0, 0, 0.05),
        0px 8px 16px 0px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        min-width: 448px;
        max-width: 448px;
        min-height: 558px;
        max-height: 558px;
        overflow: auto;
        opacity: 0;
        visibility: hidden;
        z-index: 999999;
      }

      .mew-wallet-modal-container-mew-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background-color: transparent;
        cursor: default;
        visibility: hidden;
        opacity: 0;
        transition: all 0.35s ease-in;
        z-index: 999999;
      }

      div.mew-wallet-modal-container-mew-modal.is-visible {
        visibility: visible;
        opacity: 1;
        background-color: transparent;
      }

      div.mew-wallet-modal-dialog.is-visible {
        visibility: visible;
        opacity: 1;
        z-index: 99999999999999;
      }

      .mew-wallet-modal-dialog > * {
       /* padding: 1rem; */
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .modal-header .close-modal {
        font-size: 1.5rem;
      }

`;
};
export {
  cssStyles,
  htmlDesign,
  noticetext,
  windowInformer,
  modalFrame,
  modalCSS
};
