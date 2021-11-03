/* global Cypress */
import networks from '../../src/constants/networks';

const nets = {
  mainnet: networks.mainnet,
  testnet: networks.testnet,
  devnet: {
    serviceUrl: Cypress.env('serviceUrl'),
  },
};

export default nets;
