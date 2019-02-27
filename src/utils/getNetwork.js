import Lisk from 'lisk-elements';
import networks from '../constants/networks';

const getNetwork = (code) => {
  let network;
  Object.keys(networks).forEach((key) => {
    if (networks[key].code === code) {
      network = networks[key];
    }
  }, this);
  return network;
};

export default getNetwork;

/**
 * If Mainnet or Testnet returns the name, if custom node returns the nethash
 * @param {Object} peers - Peers object from store, with options.code or options.nethash set.
 */
export const getNetworkIdentifier = (peers) => {
  const code = peers.options.code;
  const network = (Lisk.constants.MAINNET_NETHASH === peers.options.nethash && networks.mainnet)
    || (Lisk.constants.TESTNET_NETHASH === peers.options.nethash && networks.testnet)
    || getNetwork(code);
  return !network.custom
    ? network.name.toLowerCase()
    : peers.options.nethash;
};
