const cssStyles = `
    .outer-container{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
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
    }
    .container{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
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
      width: 256px;
    }
    .qr-code{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      text-align: center;
      box-sizing: border-box;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
      display: inline-block;
      padding: 16px 16px 0 16px;
    }
    .text-one{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      text-align: center;
      box-sizing: border-box;
      font-size: 20px;
      margin-bottom: 0;
      margin-top: 0;
    }
    .text-two{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      text-align: center;
      box-sizing: border-box;
      font-size: 13px;
      font-weight: normal;
      margin-bottom: 16px;
      margin-top: 0;
      opacity: 0.8;
    }
    .list-style{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      box-sizing: border-box;
      font-size: 13px;
      line-height: 1.5;
      list-style-position: inside;
      margin-bottom: 16px;
      margin-top: 16px;
      padding: 0;
      text-align: left;
    }
    .bottom-container{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      text-align: center;
      box-sizing: border-box;
      flex-grow: 0;
      flex-shrink: 0;
      margin-bottom: 16px;
    }
    .bottom-container-text{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      box-sizing: border-box;
      font-size: 13px;
      margin: 0;
      opacity: 0.5;
      text-align: center;
    }
    .bottom-container-text-old{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Arial", sans-serif;
      color: #050f19;
      box-sizing: border-box;
      font-size: 13px;
      margin: 0;
      opacity: 0.5;
      padding: 16px;
      text-align: center;
    }
    
    .refreshIcon {
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hidden{
    display: none;
    }
    `;
// <button id="refresh" style="display: none">Refresh code</button>
const htmlDesign = (refresh, image) => {
  let middlePart = '';
  const beginningPart = `
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
            <div id="refresh-container" class="refreshIcon hidden">
            <img id="refresh" src="${refresh}"/>
            </div>
            
              <ol class="list-style">
                <li>Open compatible wallet app</li>
                <li>Find and open the QR scanner</li>
                <li>Scan this QR code</li>
              </ol>
            </div>
            <div class="bottom-container">
            
            <h5 class="bottom-container-text">Powered by</h5>
             MEWconnect

`;
  if (!image) {
    // eslint-disable-next-line no-console
    console.log(image); // todo remove dev item
    middlePart = 'MEWconnect';
  } else {
    middlePart = `
             <img src="${image}" />
`;
  }

  const endingPart = `           </div>
          </div>
          <script>
          const channel = new BroadcastChannel('refresh-channel');
          const refreshContainer = window.document.getElementById("refresh-container")
          const refreshButton = window.document.getElementById("refresh");
          
          refreshButton.addEventListener("click", () => {
            channel.postMessage("refresh");
          })
          setTimeout(() => {
            refreshContainer.className = refreshContainer.className.replace('hidden', '');
          }, 5000)

</script>
        </body>
      </html>`;

  return beginningPart + middlePart + endingPart;
};

const noticetext = `

        div#Notifications.hidden {
          visibility: hidden; 
        }
        
        div#Notifications.shown {
          visibility: visible; 
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
        border: 0;
        border-style: none;
        border-width: medium;
        border-color: inherit;
        border-bottom: 0;
        border-bottom-color: inherit;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-style: none;
        border-bottom-width: medium;
        border-collapse: separate;
        border-image: none;
        border-left: 0;
        border-left-color: inherit;
        border-left-style: none;
        border-left-width: medium;
        border-radius: 0;
        border-right: 0;
        border-right-color: inherit;
        border-right-style: none;
        border-right-width: medium;
        border-spacing: 0;
        border-top: 0;
        border-top-color: inherit;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top-style: none;
        border-top-width: medium;
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
        column-rule-width: none;
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
        font: normal;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
        Arial, sans-serif;
        font-size: medium;
        font-style: normal;
        font-variant: normal;
        font-weight: normal;
        height: auto;
        hyphens: none;
        left: auto;
        letter-spacing: normal;
        line-height: normal;
        list-style: none;
        list-style-image: none;
        list-style-position: outside;
        list-style-type: disc;
        margin: 0;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        max-height: none;
        max-width: none;
        min-height: 0;
        min-width: 0;
        opacity: 1;
        orphans: 0;
        outline: 0;
        outline-color: invert;
        outline-style: none;
        outline-width: medium;
        overflow: visible;
        overflow-x: visible;
        overflow-y: visible;
        padding: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
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
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
        Arial, sans-serif;
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
        animation: WalletLinkNotificationProgressBar 2s linear infinite;
      }

      @keyframes WalletLinkNotificationProgressBar {
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
      `;

const windowInformer = `
<div class="Notification Notificationshow NotificationExpand">
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
    </div>
`;
export { cssStyles, htmlDesign, noticetext, windowInformer };
