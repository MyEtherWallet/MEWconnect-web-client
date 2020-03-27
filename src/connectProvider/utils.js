export function isLocalStorageBlocked() {
  try {
    localStorage.getItem('test');
  } catch (err) {
    return true;
  }
  return false;
}

export function postMessageToParent(message, origin = '*') {
  if (window.opener) {
    window.opener.postMessage(message, origin);
    return;
  }
  if (window.parent !== window) {
    window.parent.postMessage(message, origin);
  }
}
