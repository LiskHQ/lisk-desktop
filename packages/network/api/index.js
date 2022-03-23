import * as lsk from '@token/utilities/lsk';
import * as btc from './btc';
import functionMapper from '../functionMapper';

const networkAPI = functionMapper(lsk, btc);

export const getPeers = networkAPI.getPeers;
export const isMainnetBTC = networkAPI.isMainnetBTC;
export const getNetworkConfig = networkAPI.getNetworkConfig;
export const getNetworkStatistics = networkAPI.getNetworkStatistics;
export const getNetworkStatus = networkAPI.getNetworkStatus;
export const getServerUrl = networkAPI.getServerUrl;
