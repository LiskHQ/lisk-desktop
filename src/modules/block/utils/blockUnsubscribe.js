import { unsubscribe } from '@common/utilities/api/ws';
import { wsMethods } from '@block/config';

/**
 * Disconnects from block change websocket event and deletes socket connection
 *
 * @param {Object} network - Redux network state
 */
const blockUnsubscribe = () => {
  unsubscribe(wsMethods.blocksChange);
};

export default blockUnsubscribe;
