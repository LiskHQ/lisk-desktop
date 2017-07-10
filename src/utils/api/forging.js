import moment from 'moment';
import { requestToActivePeer } from './peers';

export const getDelegate = (activePeer, publicKey) =>
  requestToActivePeer(activePeer, 'delegates/get', {
    publicKey,
  });

export const getForgedBlocks = (activePeer, limit = 10, offset = 0, generatorPublicKey) =>
  requestToActivePeer(activePeer, 'blocks', {
    limit,
    offset,
    generatorPublicKey,
  });

export const getForgedStats = (activePeer, startMoment, generatorPublicKey) =>
  requestToActivePeer(activePeer, 'delegates/forging/getForgedByAccount', {
    generatorPublicKey,
    start: moment(startMoment).unix(),
    end: moment().unix(),
  });
