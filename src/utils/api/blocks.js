import { getAPIClient } from './lsk/network';

export const getBlocks = (liskAPIClient, options) =>
  getAPIClient(liskAPIClient).blocks.get(options);

export default {
  getBlocks,
};
