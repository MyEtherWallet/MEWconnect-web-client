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

const windowPopup = (refresh, image) => {
  if (!image) {
    return `
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
             MEWconnect
           </div>
          </div>
        </body>
      </html>
`;
  } else {
    return `
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        <meta name="theme-color" content="#000000"/>
        <title>MEWconnect</title>
      </head>

        <body>
          <div id="outer-container" class="outer-container">
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
             <img src="${image}" />
           </div>
          </div>
        </body>
      </html>
`;
  }
};

const noticeHtml = (elementId, imageSrc) => {
  return `
  <div id="${elementId + '-close'}">
  X
</div>
  <img id="${elementId + '-img'}" src="${imageSrc}"/>
  <div id="${elementId + '-text'}">
  
</div>
  `;
};

export { windowInformer, windowPopup, noticeHtml };
