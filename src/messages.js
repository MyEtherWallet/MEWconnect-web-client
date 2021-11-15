const messages = {
  decline: 'User declined action in MEW wallet app',
  approveTx: 'Check your phone to approve transaction ',
  disconnect: 'Disconnected from MEW wallet',
  complete: 'Transaction completed',
  sent: 'Transaction sent',
  failed: 'Transaction failed',
  signMessage: 'Check your phone to sign the message',
  declineSignMessage: 'User declined message signing',
  notConnected: 'Phone not connected.  Please connect your phone and try again',
  defaultMessage: 'Check your phone to continue',
  error: 'An error occurred while preparing the last action',
  communicationError:
    'Could not complete last response from MEW wallet. Nothing was sent. Please try to send or sign again.',
  disconnectError: ''
};

const messageConstants = {
  decline: 'decline',
  approveTx: 'approveTx',
  disconnect: 'disconnect',
  complete: 'complete',
  sent: 'sent',
  failed: 'failed',
  signMessage: 'signMessage',
  error: 'error',
  notConnected: 'notConnected',
  declineMessage: 'declineSignMessage',
  communicationError: 'communicationError',
  disconnectError: 'disconnectError'
};

export { messages, messageConstants };
