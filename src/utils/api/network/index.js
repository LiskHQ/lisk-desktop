import * as lsk from './lsk';
import * as btc from './btc';
import functionMapper from '../functionMapper';

const networkAPI = functionMapper(lsk, btc);

export const getConnectedPeers = networkAPI.getConnectedPeers;
export const getNetworkCode = networkAPI.getNetworkCode;
export const getNetworkConfig = networkAPI.getNetworkConfig;
export const getNetworkStatistics = networkAPI.getNetworkStatistics;
export const getNetworkStatus = networkAPI.getNetworkStatus;
export const getServerUrl = networkAPI.getServerUrl;
