import moment from 'moment';
import { requestActivePeer } from './peers';

export const getDelegate = (activePeer, publicKey) => {
  return requestActivePeer(activePeer, 'delegates/get', {
    publicKey,
  });
};

export const getForgedBlocks = (activePeer, limit = 10, offset = 0, generatorPublicKey) => {
  return requestActivePeer(activePeer, 'blocks', {
    limit,
    offset,
    generatorPublicKey,
  });
};

export const getForgedStats = (activePeer, startMoment, generatorPublicKey) => {
  return requestActivePeer(activePeer, 'delegates/forging/getForgedByAccount', {
    generatorPublicKey,
    start: moment(startMoment).unix(),
    end: moment().unix(),
  });
};
