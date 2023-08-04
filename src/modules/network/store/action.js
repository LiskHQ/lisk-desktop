import { tokenKeys } from '@token/fungible/consts/tokens';
import { getNetworkConfig } from '@network/utils/api';
import actionTypes from './actionTypes';

export const networkConfigSet = async (data) => {
  const promises = tokenKeys.map((token) => getNetworkConfig(data, token));

  const networks = await Promise.all(promises);
  const networksWithNames = tokenKeys.reduce(
    (acc, token, index) => ({ ...acc, [token]: networks[index] }),
    {}
  );

  return {
    type: actionTypes.networkConfigSet,
    data: { name: data.name, networks: networksWithNames },
  };
};

export const networkStatusUpdated = (data) => ({
  data,
  type: actionTypes.networkStatusUpdated,
});

export const networkSelected = (data) => ({
  data,
  type: actionTypes.networkSelected,
});

export const customNetworkStored = (data) => ({
  data,
  type: actionTypes.customNetworkStored,
});

export const customNetworkRemoved = () => ({
  type: actionTypes.customNetworkRemoved,
});
