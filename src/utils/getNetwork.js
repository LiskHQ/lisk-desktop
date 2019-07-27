import Lisk from '@liskhq/lisk-client';
import i18next from 'i18next';
import networks from '../constants/networks';

const getNetwork = (networkName) => {
  let network;
  Object.keys(networks).forEach((key) => {
    if (networks[key].name === networkName) {
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

export const getNetworksList = () =>
  Object.keys(networks)
    .filter(network => network !== 'default')
    .map((network, index) => ({
      label: i18next.t(networks[network].name),
      value: index,
    }));
