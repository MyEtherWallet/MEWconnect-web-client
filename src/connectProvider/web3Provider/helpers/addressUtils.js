import web3 from 'web3';

const isAddress = address => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    return false;
  } else if (
    /^(0x|0X)?[0-9a-f]{40}$/.test(address) ||
    /^(0x|0X)?[0-9A-F]{40}$/.test(address)
  ) {
    return true;
  }
  return web3.utils.checkAddressChecksum(address);
};
const toChecksumAddress = address => {
  return web3.utils.toChecksumAddress(address);
};
export { isAddress, toChecksumAddress };
