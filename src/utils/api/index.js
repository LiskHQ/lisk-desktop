import { tokenMap } from '../../constants/tokens';
import lskApiUtils from './lsk';
import btcApiUtils from './btc';

export default {
  [tokenMap.LSK.key]: lskApiUtils,
  [tokenMap.BTC.key]: btcApiUtils,
};
