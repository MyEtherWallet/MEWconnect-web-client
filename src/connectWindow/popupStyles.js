const notifierCSS = elementId => {
  return `
    /* The snackbar - position it at the bottom and in the middle of the screen */
      #${elementId}-img {
        position: relative;
        top: 10px;
        left: 5px;
        width: 23.2px;
        height: 23.2px;
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
        min-height: 110px;
        /*margin-left: -125px; !* Divide value of min-width by 2 *!*/
        background-color: white;
        color: #000000; /* White text color */
        text-align: center; /* Centered text */
        border-radius: 15px; /* Rounded borders */
        border: rgba(0, 0, 0, 0.1) solid 1px;
        /*margin: 15px; !* Padding *!*/
        position: fixed; /* Sit on top of the screen */
        z-index: 999999999999999; /* Add a z-index if needed */
        right: 30px; /* Center the snackbar */
        top: 30px; /* 30px from the bottom */
        box-shadow: 0px 16px 12px rgba(0, 0, 0, 0.1);
      }

      #${elementId}-label-text {
        width: 78px;
        height: 16px;
        color: rgb(95, 99, 104);
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        letter-spacing: 0.37px;
        line-height: 14px;
        padding-top: 15px;
        padding-left: 12px;
      }
      
       #${elementId}-text{
        width:200px;
        text-align: left;
        padding: 10px 20px;
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        font-weight: normal;
        height: 38px;
        letter-spacing: 0.43px;
      }
      
      .mew-connect-notifier-created-tx-link{
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        font-weight: normal;
        height: 38px;
        color: rgb(95, 99, 104);
      }

      #${elementId}-close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: rgb(95, 99, 104);;
        cursor: pointer;
      }

      #${elementId}-label-container {
        position: relative;
        font-family: 'Roboto', sans-serif;
        color: rgb(95, 99, 104);;
        background: rgb(249, 250, 251);
        /*background: orange;*/
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        text-align: left;
        box-sizing: border-box;
        /*margin-bottom: 16px;*/
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
        justify-content: left;
        padding-bottom: 10px;
      }

      /* Show the snackbar when clicking on a button (class added with JavaScript) */
      #${elementId}.show {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 3.5s;
        animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 3.5s;
      }

      #${elementId}.show-persistent {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 5.5s;
        animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 5.5s;
      }

      #${elementId}.show-persistent-leave {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadeout-${elementId} 0.5s 1.5s;
        animation: fadeout-${elementId} 0.5s 1.5s;
      }

      #${elementId}.show-in {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s;
        animation: fadein-${elementId} 0.5s;
      }

      #${elementId}.show-out {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadeout-${elementId} 0.5s;
        animation: fadeout-${elementId} 0.5s;
      }

      /* Animations to fade the snackbar in and out */
      @-webkit-keyframes fadein-${elementId} {
        from {
          top: 0;
          opacity: 0;
        }
        to {
          top: 30px;
          opacity: 1;
        }
      }

      @keyframes fadein-${elementId} {
        from {
          top: 0;
          opacity: 0;
        }
        to {
          top: 30px;
          opacity: 1;
        }
      }

      @-webkit-keyframes fadeout-${elementId} {
        from {
          top: 30px;
          opacity: 1;
        }
        to {
          top: 0;
          opacity: 0;
        }
      }

      @keyframes fadeout-${elementId} {
        from {
          top: 30px;
          opacity: 1;
        }
        to {
          top: 0;
          opacity: 0;
        }
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
    `;
};

const connectedNotifierCSS = elementId => {
  return `      
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

      /*  ---------------------------------------*/
      #${elementId}-img {
        width: 43.5px;
        height: 43.5px;
        background-color: white;
        border-radius: 10px;
        grid-column-start: 1;
        grid-column-end: 1;
        margin-top: 16px;
        justify-self: center;
      }

      .hidden {
        visibility: hidden;
      }

      .shown {
        visibility: visible;
      }

      .${elementId}-big{
        color: white;
        font-size: 14px;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        letter-spacing: 0.37px;
        line-height: 14px;
        padding-bottom: 4px;
      }

      .${elementId}-label-text{
        color: white;
        font-size: 12px;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        letter-spacing: 0.37px;
        line-height: 12px;
        padding-bottom: 4px;
      }

      .${elementId}-vertical-flex{
        padding-top: 15px;
        align-content: start;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start
      }

      #${elementId} {
        display: grid;
        grid-template-columns:  30% auto;
        background: rgb(5, 192, 165);
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05),
          0px 4px 8px 0px rgba(0, 0, 0, 0.09);
        visibility: hidden; /* Hidden by default. Visible on click */
        min-width: 240px; /* Set a default minimum width */
        min-height: 77px;
        color: #000000; /* White text color */
        text-align: center; /* Centered text */
        position: fixed; /* Sit on top of the screen */
       /* z-index: 9999999999999;  Add a z-index if needed */
        right: 30px; /* Center the snackbar */
        top: 30px; /* 30px from the bottom */
      }

      #${elementId}-close {
        position: absolute;
        top: 10px;
        right: 10px;
        color: white;
        cursor: pointer;
      }

      #${elementId}-label-container {
        position: relative;
        grid-column-start: 2;
        grid-column-end: 2;
        font-family: 'Roboto', sans-serif;
        color: #050f19;
        text-align: left;
        box-sizing: border-box;
        /*margin-bottom: 16px;*/
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
        justify-content: left;
        padding-bottom: 10px;
      }

      /* Show the snackbar when clicking on a button (class added with JavaScript) */
      #${elementId}.show {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 3.5s;
        animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 3.5s;
      }

      #${elementId}.show-persistent {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 5.5s;
        animation: fadein-${elementId} 0.5s,
          fadeout-${elementId} 0.5s 5.5s;
      }

      #${elementId}.show-persistent-leave {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadeout-${elementId} 0.5s 1.5s;
        animation: fadeout-${elementId} 0.5s 1.5s;
      }

      #${elementId}.show-in {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein-${elementId} 0.5s;
        animation: fadein-${elementId} 0.5s;
      }

      #${elementId}.show-out {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadeout-${elementId} 0.5s;
        animation: fadeout-${elementId} 0.5s;
      }

      /* Animations to fade the snackbar in and out */
      @-webkit-keyframes fadein-${elementId} {
        from {
          top: 0;
          opacity: 0;
        }
        to {
          top: 30px;
          opacity: 1;
        }
      }

      @keyframes fadein-${elementId} {
        from {
          top: 0;
          opacity: 0;
        }
        to {
          top: 30px;
          opacity: 1;
        }
      }

      @-webkit-keyframes fadeout-${elementId} {
        from {
          top: 30px;
          opacity: 1;
        }
        to {
          top: 0;
          opacity: 0;
        }
      }

      @keyframes fadeout-${elementId} {
        from {
          top: 30px;
          opacity: 1;
        }
        to {
          top: 0;
          opacity: 0;
        }
      }

`;
};

const WindowInformerCSS = `

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
        z-index: 999999999;
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
export { notifierCSS, connectedNotifierCSS, WindowInformerCSS };
