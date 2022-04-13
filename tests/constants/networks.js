/* global Cypress */
// import networks from '@network/configuration/networks';
import networks from '../../packages/network/configuration/networks';

const nets = {
  mainnet: networks.mainnet,
  testnet: networks.testnet,
  devnet: {
    serviceUrl: Cypress.env('serviceUrl'),
  },
};

export default nets;
