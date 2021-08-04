import { messages } from '../messages';
export function getMessage(text, extra) {
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
      case 'nonStandardMessage':
        return extra.message;
    }
  }

  const regEx = new RegExp(/^Returned error:/);
  if (regEx.test(text)) {
    return text;
  }

  if (!text) {
    return messages.defaultMessage;
  }

  return messages[text];
}
