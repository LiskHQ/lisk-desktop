import { loadingStarted, loadingFinished } from 'src/modules/common/store/actions';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { getApplications } from '../api/applicationManage';
import actionTypes from './actionTypes';

/**
 * Trigger this action to toggle blockchain application pin
 *
 * @returns {Object} - Action object
 */
export const toggleApplicationPin = (chainId) => ({
  type: actionTypes.toggleApplicationPin,
  chainId,
});

/**
 * Trigger this action to load all blockchain applications
 *
 * @returns {Object} - Action object
 */
export const loadApplications = ({
  network,
  limit = DEFAULT_LIMIT,
  offset = 0,
}) => async (dispatch) => {
  dispatch(loadingStarted(actionTypes.loadApplications));
  const params = { limit, offset };
  try {
    const { data, meta } = getApplications({ network, params });
    dispatch({
      type: actionTypes.loadApplicationsSuccess,
      data: {
        offset,
        list: data,
        count: meta.total,
      },
    });
  } catch (error) {
    dispatch({
      type: actionTypes.loadApplicationsError,
      data: { error },
    });
  } finally {
    dispatch(loadingFinished(actionTypes.loadApplications));
  }
};

/**
 * Trigger this action to add blockchain application
 *
 * @returns {Object} - Action object
 */
export const addApplication = (application) => ({
  type: actionTypes.addApplicationByChainId,
  data: application,
});

/**
 * Trigger this action to delete blockchain application
 *
 * @returns {Object} - Action object
 */
export const deleteApplication = (chainId) => ({
  type: actionTypes.deleteApplicationByChainId,
  data: chainId,
});

/**
 * Trigger this action to set current blockchain application
 *
 * @returns {Object} - Action object
 */
export const setCurrentApplication = (application) => ({
  type: actionTypes.setCurrentApplication,
  application,
});
