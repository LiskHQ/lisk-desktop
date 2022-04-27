import { unsubscribe } from '@common/utilities/api/ws';
import { wsMethods } from '../../constants/constants';

/**
 * Disconnects from block change websocket event and deletes socket connection
 *
 * @param {Object} network - Redux network state
 */
export const blockUnsubscribe = () => {
  unsubscribe(wsMethods.blocksChange);
};
