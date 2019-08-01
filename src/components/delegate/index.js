// istanbul ignore file
import { translate } from 'react-i18next';
import { getDelegateInfo } from '../../utils/api/delegates';
import DelegateTab from './delegateTab';
import withData from '../../utils/withData';

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
};

export default withData(apis)(translate()(DelegateTab));
