import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { getAccount } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import MultisigAccountDetails from '../components/multisigAccountDetails';

export default compose(
  withRouter,
  withData({
    wallet: {
      apiUtil: (network, params) => getAccount({ network, params }),
      defaultData: {},
      autoload: false,
    },
  }),
  withTranslation()
)(MultisigAccountDetails);
