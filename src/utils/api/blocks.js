export const getBlocks = (liskAPIClient, options) =>
  liskAPIClient.blocks.get(options);

export default {
  getBlocks,
};
