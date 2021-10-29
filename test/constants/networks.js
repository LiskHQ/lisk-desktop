/* global Cypress */
import { networks } from '../../src/constants';

const nets = {
  mainnet: { ...networks.mainnet, serviceUrl: networks.mainnet.serviceUrl },
  testnet: { ...networks.testnet, serviceUrl: networks.testnet.serviceUrl },
  devnet: {
    serviceUrl: Cypress.env('serviceUrl'),
  },
};

export default nets;
