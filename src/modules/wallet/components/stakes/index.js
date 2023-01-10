// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getStakes } from '@pos/validator/api';
import { getAccounts } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import Stakes from './stakes';

const apis = {
  votes: {
    apiUtil: (network, params) => getStakes({ network, params }),
    defaultData: [],
    autoload: false,
    transformResponse: (response) => response.data?.votes ?? [],
  },
  accounts: {
    apiUtil: (network, params) => getAccounts({ network, params }),
    autoload: false,
    defaultData: {},
    transformResponse: (response) =>
      response.data.reduce((dict, account) => {
        dict[account.summary.address] = account;
        return dict;
      }, {}),
  },
};

const mapStateToProps = (state) => ({
  sentVotes: state.voting,
  isDelegate: state.wallet?.info?.LSK?.summary.isDelegate,
});

export default compose(connect(mapStateToProps), withData(apis), withTranslation())(Stakes);
