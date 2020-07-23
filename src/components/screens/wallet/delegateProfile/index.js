// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getNextForgers } from '../../../../utils/api/delegates';
import { getBlocks } from '../../../../utils/api/blocks';
import { getTransactions } from '../../../../utils/api/transactions';
import DelegateProfile from './delegateProfile';
import transactionTypes from '../../../../constants/transactionTypes';
import withData from '../../../../utils/withData';

const apis = {
  delegate: {
    apiUtil: (liskAPIClient, params) => liskAPIClient.delegates.get(params),
    defaultData: {},
    getApiParams: (state, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => response.data[0],
  },
  lastBlock: {
    apiUtil: getBlocks,
    defaultData: false,
    transformResponse: response => (response.data[0] && response.data[0].timestamp),
  },
  txDelegateRegister: {
    apiUtil: (apiClient, params) => getTransactions(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      address: ownProps.address,
      networkConfig: state.network,
      type: transactionTypes().registerDelegate.outgoingCode,
      limit: 1,
    }),
    defaultData: false,
    transformResponse: response => (response.data[0] && response.data[0].timestamp),
  },
  nextForgers: {
    apiUtil: getNextForgers,
    defaultData: [],
    autoload: true,
    getApiParams: () => ({
      limit: 101,
    }),
  },
};

export default withData(apis)(withTranslation()(DelegateProfile));
