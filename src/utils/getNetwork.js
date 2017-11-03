import networks from '../constants/networks';

export default (code) => {
  let network;
  Object.keys(networks).forEach((key) => {
    if (networks[key].code === code) {
      network = networks[key];
    }
  }, this);
  return network;
};
