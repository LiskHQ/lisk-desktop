import { getAPIClient } from './lsk/network';

export const getBlocks = (network, options) =>
  getAPIClient(network).blocks.get(options);

export default {
  getBlocks,
};
