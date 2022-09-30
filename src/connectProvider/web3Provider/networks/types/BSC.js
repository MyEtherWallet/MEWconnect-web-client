import tokens from '../tokens/tokens-bsc.json';
export default {
  name: 'BSC',
  name_long: 'Binance Smart Chain',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorerTX: 'https://bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://bscscan.com/address/[[address]]',
  chainID: 56,
  tokens: tokens,
  contracts: [],
  currencyName: 'BNB'
};
