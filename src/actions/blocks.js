import actionTypes from '../constants/actions';

// eslint-disable-next-line import/prefer-default-export
export const olderBlocksRetrieved = ({ blocks }) => ({
  type: actionTypes.olderBlocksRetrieved,
  blocks,
});
