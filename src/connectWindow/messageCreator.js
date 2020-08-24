export function getMessage(text, extra) {
  const messages = {
    decline: 'User declined action in MEW wallet app',
    approveTx: 'Check your phone to approve transaction ',
    disconnect: 'Disconnected from MEW wallet',
    complete: 'Transaction completed',
    sent: 'Transaction send',
    failed: 'Transaction failed',
    signMessage: 'Check your phone to sign the message',
    declineSignMessage: 'User declined message signing',
    notConnected:
      'Phone not connected.  Please connect your phone and try again to sign the transaction',
    defaultMessage: 'Check your phone to continue',
    error: 'An error occurred while preparing the last action'
  };

  if (extra) {
    switch (extra.type) {
      case 'sent':
        return `${
          messages[extra.type]
        } <br/><a class="mew-connect-notifier-created-tx-link" href="${extra.explorerPath.replace(
          '[[txHash]]',
          extra.hash
        )}" target="_blank">View details</a>`;
      case 'failed':
        return `${
          messages[extra.type]
        } <br/><a class="mew-connect-notifier-created-tx-link" href="${extra.explorerPath.replace(
          '[[txHash]]',
          extra.hash
        )}" target="_blank">View details</a>`;
    }
  }

  if (!text) {
    return messages.defaultMessage;
  }

  return messages[text];
}
