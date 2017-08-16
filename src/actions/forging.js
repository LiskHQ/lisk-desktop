import actionTypes from '../constants/actions';
import { getForgedBlocks, getForgedStats } from '../utils/api/forging';

export const updateForgedBlocks = data => ({
  data,
  type: actionTypes.forgedBlocksUpdated,
});

export const fetchAndUpdateForgedBlocks = (activePeer, limit, offset, generatorPublicKey) =>
  (dispatch) => {
    getForgedBlocks(activePeer, limit, offset, generatorPublicKey).then((response) => {
      dispatch(updateForgedBlocks(response.blocks));
    });
  };

export const updateForgingStats = data => ({
  data,
  type: actionTypes.forgingStatsUpdated,
});

export const fetchAndUpdateForgedStats = (activePeer, key, startMoment, generatorPublicKey) =>
  (dispatch) => {
    getForgedStats(activePeer, startMoment, generatorPublicKey).then((response) => {
      dispatch(updateForgingStats({ [key]: response.forged }));
    });
  };
