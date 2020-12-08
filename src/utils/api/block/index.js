import { subscribe, unsubscribe } from '../ws';

const WS_ENDPOINTS = {
  BLOCKS_CHANGE: 'blocks/change',
};

export const getBlock = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlock', token: 'shared', data }));

export const getBlocks = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlocks', token: 'shared', data }));

export const blockSubscribe = (network, callback, onDisconnect, onReconnect) => {
  subscribe(network.serviceUrl, WS_ENDPOINTS.BLOCKS_CHANGE, callback, onDisconnect, onReconnect);
};

export const blockUnsubscribe = () => {
  unsubscribe(WS_ENDPOINTS.BLOCKS_CHANGE);
};
