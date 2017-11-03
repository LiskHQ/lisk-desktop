import actionTypes from '../constants/actions';
import { getForgedBlocks, getForgedStats } from '../utils/api/forging';
import { errorAlertDialogDisplayed } from './dialog';

export const forgedBlocksUpdated = data => ({
  data,
  type: actionTypes.forgedBlocksUpdated,
});

export const fetchAndUpdateForgedBlocks = ({ activePeer, limit, offset, generatorPublicKey }) =>
  (dispatch) => {
    getForgedBlocks(activePeer, limit, offset, generatorPublicKey)
      .then(response =>
        dispatch(forgedBlocksUpdated(response.blocks)),
      )
      .catch((error) => {
        dispatch(errorAlertDialogDisplayed({ text: error.message }));
      });
  };

export const forgingStatsUpdated = data => ({
  data,
  type: actionTypes.forgingStatsUpdated,
});

export const fetchAndUpdateForgedStats = ({ activePeer, key, startMoment, generatorPublicKey }) =>
  (dispatch) => {
    getForgedStats(activePeer, startMoment, generatorPublicKey)
      .then(response =>
        dispatch(forgingStatsUpdated({ [key]: response.forged })),
      )
      .catch((error) => {
        dispatch(errorAlertDialogDisplayed({ text: error.message }));
      });
  };
