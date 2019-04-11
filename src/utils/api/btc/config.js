import * as bitcoin from 'bitcoinjs-lib';

const getBtcConfig = netCode => ({
  isTestnet: netCode !== 0,
  url: netCode !== 0 ? 'https://testnet.blockchain.info' : 'https://blockchain.info',
  minerFeesURL: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
  network: netCode !== 0 ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  derivationPath: netCode !== 0 ? "m/44'/1'/0'/0/0" : "m/44'/0'/0'/0/0",
  transactionExplorerURL: `https://www.blockchain.com/${netCode !== 0 ? 'btctest' : 'btc'}/tx`,
});

export default getBtcConfig;
