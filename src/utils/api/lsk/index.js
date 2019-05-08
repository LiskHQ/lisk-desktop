import * as account from './account';
import * as network from './network';
import * as service from './liskService';
import * as transactions from './transactions';

export default {
  account,
  network,
  service: service.default,
  transactions,
};
