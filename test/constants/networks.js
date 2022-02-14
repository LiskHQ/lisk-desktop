/* global Cypress */
import networks from '../../src/constants/networks';

const nets = {
  mainnet: networks.mainnet,
  testnet: networks.testnet,
  devnet: {
    serviceUrl: 'http://127.0.0.1:9901',
  },
};

export default nets;
