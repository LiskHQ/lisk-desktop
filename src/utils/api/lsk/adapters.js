import store from '../../../store';

const defaultApiVersion = '2.x';
/**
 * Transforms transactions of Core 3.x to the shape of
 * transactions in Core 2.x
 * We use this in order to keep forward compatibility
 *
 * @param {Object} data
 * A transaction object
 * @returns {Object}
 * Morphed transaction in the shape of Core 2.x transactions.
 */
export const txAdapter = (data) => { // eslint-disable-line import/prefer-default-export
  const apiVersion = store.getState().network.apiVersion;
  if (apiVersion === defaultApiVersion) return data;
  const morphedData = { ...data };

  if (data.type === 8) {
    morphedData.recipientId = data.asset.recipientId;
    morphedData.amount = data.asset.amount;
  }

  morphedData.type -= 8;
  return morphedData;
};

export const adaptTransaction = (res) => { // eslint-disable-line import/prefer-default-export
  const apiVersion = store.getState().network.apiVersion;
  if (apiVersion === defaultApiVersion) return res;
  const morphedData = res.data.map(transaction => txAdapter(transaction));
  return {
    links: res.links,
    meta: res.meta,
    data: morphedData,
  };
};

export const adaptTransactions = (res) => { // eslint-disable-line import/prefer-default-export
  const apiVersion = store.getState().network.apiVersion;
  if (apiVersion === defaultApiVersion) return res;
  const morphedData = res.data.map(transaction => txAdapter(transaction));
  return {
    links: res.links,
    meta: res.meta,
    data: morphedData,
  };
};

export const adaptDelegateQueryParams = (params) => {
  const apiVersion = store.getState().network.apiVersion;
  if (apiVersion === defaultApiVersion) return params;
  const morphedParams = {
    ...params,
    sort: 'voteWeight:asc',
  };
  return morphedParams;
};
