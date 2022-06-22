/* global Cypress */
import networks from '../../src/modules/network/configuration/networks';

const nets = {
  mainnet: networks.mainnet,
  testnet: networks.testnet,
  customNode: {
    serviceUrl: Cypress.env('serviceUrl'),
  },
};

export default nets;
