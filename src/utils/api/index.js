import { tokenMap } from '../../constants/tokens';
import lskApiUtils from './lsk';
import btcApiUtils from './btc';

export { default as account } from './account';
export { default as transactions } from './transactions';
export { default as service } from './service';

export default {
  [tokenMap.LSK.key]: lskApiUtils,
  [tokenMap.BTC.key]: btcApiUtils,
};
