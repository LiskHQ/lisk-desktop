import functionMapper from '@common/utilities/api/functionMapper';
import * as lsk from './lsk';

const networkAPI = functionMapper(lsk);

export const getPeers = networkAPI.getPeers;
export const isMainnetBTC = networkAPI.isMainnetBTC;
export const getNetworkConfig = networkAPI.getNetworkConfig;
export const getNetworkStatistics = networkAPI.getNetworkStatistics;
export const getNetworkStatus = networkAPI.getNetworkStatus;
export const getServerUrl = networkAPI.getServerUrl;
