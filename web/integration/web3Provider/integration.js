import PopUpHandler from './popUpHandler';

export default class Integration extends PopUpHandler {
  constructor() {
    super();
    this.sessionId = '';
    this.sessionId = false;
    this.actionsPendingSessionId = [];
    this.walletLinkUrl = 'connect-MEWconnect';
  }

}