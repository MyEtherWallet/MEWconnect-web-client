const fetch = require('node-fetch');
const fs = require('fs');
const configs = require('./configs');
const tokenList = require('./lists/tokens.json');
// const contractList = require('./lists/contracts.json');

const fetchTokens = async () => {
  try {
    if (!fs.existsSync(configs.TOKENS_PATH)) {
      fs.mkdirSync(configs.TOKENS_PATH);
    }
    const tokenFileURL =
      'https://cdn.jsdelivr.net/gh/MyEtherWallet/ethereum-lists@master/dist/tokens/';
    if (tokenList !== undefined && tokenList.length > 0) {
      for (let i = 0; i < tokenList.length; i++) {
        const tokenFile = tokenList[i];
        if (configs.SUPPORTED_CHAINS.includes(tokenFile.name)) {
          const tokensCollection = await fetch(
            `${tokenFileURL + tokenFile.name}/tokens-${tokenFile.name}.json`
          )
            .then(res => res.json())
            .catch(err => console.log(err));
          if (tokensCollection !== undefined) {
            console.log('Writing tokens for the network: ' + tokenFile.name);
            fs.writeFileSync(
              `${configs.TOKENS_PATH}/tokens-${tokenFile.name}.json`,
              JSON.stringify(tokensCollection)
            );
          }
        }
      }
    }
  } catch (e) {
    console.error(e); // Not captured by sentry
  }
};

const run = async () => {
  await fetchTokens();
};

(async () => {
  try {
    await run();
    console.log('Done');
  } catch (e) {
    console.error(e);
  }
})();
