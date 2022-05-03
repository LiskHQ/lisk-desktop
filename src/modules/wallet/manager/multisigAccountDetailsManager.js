import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { getAccount } from '@wallet/utils/api';
import withData from '@common/utilities/withData';
import MultisigAccountDetails from './multisigAccountDetails';

export default compose(
  withRouter,
  withData({
    account: {
      apiUtil: (network, params) => getAccount({ network, params }, params.token),
      defaultData: {},
      getApiParams: (state) => ({
        token: state.settings.token.active,
      }),
      autoload: false,
    },
  }),
  withTranslation(),
)(MultisigAccountDetails);
