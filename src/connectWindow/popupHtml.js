const noticeHtml = (elementId, imageSrc) => {
  return `
<div id="${elementId}-label-container">
  <div id="${elementId + '-close'}">
  X
</div>
  <img id="${elementId + '-img'}" src="${imageSrc}"/>
  <span id="${elementId + '-label-text'}">MEW wallet</span>
</div>

  <div id="${elementId + '-text'}">
  
</div>
  `;
};

const connectedNoticeHtml = (elementId, imageSrc) => {
  return `
      <img id="${elementId}-img" src="${imageSrc}" />
      <div id="${elementId}-label-container">
        <div id="${elementId}-close">
          X
        </div>

        <div class="${elementId}-vertical-flex">
          <span class="${elementId}-label-text">Connected to</span>
          <span class="${elementId}-big">MEW wallet</span>
          <span class="${elementId}-label-text">Powered by MyEtherWallet</span>
        </div>
      </div>
  `;
};

export { noticeHtml, connectedNoticeHtml };
