import { requestToActivePeer } from './peers';

// eslint-disable-next-line import/prefer-default-export
export const getNethash = activePeer => (requestToActivePeer(activePeer, 'blocks/getNethash'));
