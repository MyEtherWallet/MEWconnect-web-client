const noticeHtml = (elementId, imageSrc, iconImage) => {
  return `
  <div id="${elementId}-label-container">
    <div id="${elementId + '-close'}">
      <img src="${iconImage}" height="15" width="11" />
    </div>
    <img id="${elementId + '-img'}" src="${imageSrc}"/>
    <span id="${elementId + '-label-text'}">MEW wallet</span>
  </div>
  
  <div id="${elementId + '-text'}">
  
  </div>
  `;
};

const connectedNoticeHtml = (elementId, imageSrc, iconImage) => {
  return `
  <img id="${elementId}-img" src="${imageSrc}" />
  <div id="${elementId}-label-container">
    <div id="${elementId}-close">
      <img src="${iconImage}" height="15" width="11"/>
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
