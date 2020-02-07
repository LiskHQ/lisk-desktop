// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getDelegateInfo, getNextForgers } from '../../../utils/api/delegates';
import DelegateTab from './delegateTab';
import withData from '../../../utils/withData';

const apis = {
  delegate: {
    apiUtil: getDelegateInfo,
    defaultData: {},
    getApiParams: (state, ownProps) => ({
      address: ownProps.account.address,
      publicKey: ownProps.account.publicKey,
    }),
    autoload: true,
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

export default withData(apis)(withTranslation()(DelegateTab));
