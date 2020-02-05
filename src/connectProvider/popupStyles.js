


const cssText = (elementId) =>{
  return `
    /* The snackbar - position it at the bottom and in the middle of the screen */
        #${elementId}-img {
          height: 25%;
          width: 75%;
        }
        
        .hidden {
          visibility: hidden; 
        }
        
        .shown {
          visibility: visible; 
        }
        
        #${elementId} {
          visibility: hidden; /* Hidden by default. Visible on click */
          min-width: 250px; /* Set a default minimum width */
          margin-left: -125px; /* Divide value of min-width by 2 */
          background-color: rgba(226, 226, 226, 0.2);
          color: #000000; /* White text color */
          text-align: center; /* Centered text */
          border-radius: 2px; /* Rounded borders */
          padding: 16px; /* Padding */
          position: fixed; /* Sit on top of the screen */
          z-index: 1; /* Add a z-index if needed */
          right: 30px; /* Center the snackbar */
          top: 30px; /* 30px from the bottom */
        }
        
        /* Show the snackbar when clicking on a button (class added with JavaScript) */
        #${elementId}.show {
          visibility: visible; /* Show the snackbar */
          /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
          However, delay the fade out process for 2.5 seconds */
          -webkit-animation: fadein-${elementId} 0.5s, fadeout-${elementId} 0.5s 3.5s;
          animation: fadein-${elementId} 0.5s, fadeout-${elementId} 0.5s 3.5s;
        }
        
        /* Animations to fade the snackbar in and out */
        @-webkit-keyframes fadein-${elementId} {
          from {top: 0; opacity: 0;}
          to {top: 30px; opacity: 1;}
        }
        
        @keyframes fadein-${elementId} {
          from {top: 0; opacity: 0;}
          to {top: 30px; opacity: 1;}
        }
        
        @-webkit-keyframes fadeout-${elementId} {
          from {top: 30px; opacity: 1;}
          to {top: 0; opacity: 0;}
        }
        
        @keyframes fadeout-${elementId} {
          from {top: 30px; opacity: 1;}
          to {top: 0; opacity: 0;}
        }
        
          @keyframes WalletLinkNotificationProgressBar {
        0% {
          left: 0;
          width: 0%;
          background-image: linear-gradient(
            to right,
            rgba(22, 82, 240, 0) 0%,
            rgba(22, 82, 240, 1) 100%
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
            rgba(22, 82, 240, 1) 100%
          );
        }
        50.01% {
          background-image: linear-gradient(
            to left,
            rgba(22, 82, 240, 0) 0%,
            rgba(22, 82, 240, 1) 100%
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
            rgba(22, 82, 240, 1) 100%
          );
        }
      }
    `
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
        z-index: auto;
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
          rgba(22, 82, 240, 1) 100%
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
            rgba(22, 82, 240, 1) 100%
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
            rgba(22, 82, 240, 1) 100%
          );
        }
        50.01% {
          background-image: linear-gradient(
            to left,
            rgba(22, 82, 240, 0) 0%,
            rgba(22, 82, 240, 1) 100%
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
            rgba(22, 82, 240, 1) 100%
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
        color: #1652f0;
        -webkit-text-fill-color: #1652f0;
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


const innerHTML = `
    <div class="_WalletLinkNotification _WalletLinkNotificationShow _WalletLinkNotificationExpand">
      <div class="_WalletLinkNotificationBox">
        <div class="_WalletLinkNotificationContent">
          <div class="_WalletLinkNotificationMessage">Requesting to connect to your wallet...</div>
          <img
            src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16.5539 10.4174C16.8027 10.16 16.8027 9.75167 16.5539 9.49423C16.2928 9.22408 15.8598 9.22405 15.5987 9.49415L13.2753 11.8974C12.874 12.3125 12.6734 12.5201 12.4404 12.5975C12.2357 12.6655 12.0144 12.6655 11.8096 12.5975C11.5766 12.52 11.376 12.3125 10.9747 11.8974L8.6513 9.49406C8.39018 9.22396 7.9572 9.22399 7.69612 9.49413C7.44731 9.75158 7.44731 10.1599 7.69612 10.4173L10.9745 13.8096C11.3759 14.2249 11.5766 14.4325 11.8095 14.51C12.0144 14.5781 12.2357 14.5781 12.4405 14.51C12.6735 14.4325 12.8742 14.2249 13.2756 13.8096L16.5539 10.4174Z' fill='%23050F19'/%3E%3C/svg%3E%0A"
            alt="Expand" class="_WalletLinkNotificationChevron"></div>
        <div class="_WalletLinkNotificationProgressBar"></div>
        <div class="_WalletLinkNotificationActions">
          <div class="_WalletLinkNotificationAction"><span
            class="_WalletLinkNotificationButtonInfo _WalletLinkNotificationButtonInfo1">Don’t see the popup?</span>
            <button class="_WalletLinkNotificationButton _WalletLinkNotificationButton1">Show
                                                                                         window
            </button>
          </div>
          <div class="_WalletLinkNotificationAction"><span
            class="_WalletLinkNotificationButtonInfo _WalletLinkNotificationButtonInfo2">Made a mistake?</span>
            <button class="_WalletLinkNotificationButton _WalletLinkNotificationButton2">Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="_WalletLinkNotification _WalletLinkNotificationShow _WalletLinkNotificationExpand">
      <div class="_WalletLinkNotificationBox">
        <div class="_WalletLinkNotificationContent">
          <div class="_WalletLinkNotificationMessage">Requesting to connect to your wallet...</div>
          <img
            src="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16.5539 10.4174C16.8027 10.16 16.8027 9.75167 16.5539 9.49423C16.2928 9.22408 15.8598 9.22405 15.5987 9.49415L13.2753 11.8974C12.874 12.3125 12.6734 12.5201 12.4404 12.5975C12.2357 12.6655 12.0144 12.6655 11.8096 12.5975C11.5766 12.52 11.376 12.3125 10.9747 11.8974L8.6513 9.49406C8.39018 9.22396 7.9572 9.22399 7.69612 9.49413C7.44731 9.75158 7.44731 10.1599 7.69612 10.4173L10.9745 13.8096C11.3759 14.2249 11.5766 14.4325 11.8095 14.51C12.0144 14.5781 12.2357 14.5781 12.4405 14.51C12.6735 14.4325 12.8742 14.2249 13.2756 13.8096L16.5539 10.4174Z' fill='%23050F19'/%3E%3C/svg%3E%0A"
            alt="Expand" class="_WalletLinkNotificationChevron"></div>
        <div class="_WalletLinkNotificationProgressBar"></div>
        <div class="_WalletLinkNotificationActions">
          <div class="_WalletLinkNotificationAction"><span
            class="_WalletLinkNotificationButtonInfo _WalletLinkNotificationButtonInfo1">Don’t see the popup?</span>
            <button class="_WalletLinkNotificationButton _WalletLinkNotificationButton1">Show
                                                                                         window
            </button>
          </div>
          <div class="_WalletLinkNotificationAction"><span
            class="_WalletLinkNotificationButtonInfo _WalletLinkNotificationButtonInfo2">Made a mistake?</span>
            <button class="_WalletLinkNotificationButton _WalletLinkNotificationButton2">Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`
export {
  cssText as popUpStyles,
  noticetext,
  innerHTML
};