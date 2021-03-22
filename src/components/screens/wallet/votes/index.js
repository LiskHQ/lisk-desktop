// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getVotes } from '@utils/api/delegate';
import { getAccounts } from '@utils/api/account';
import withData from '@utils/withData';
import Votes from './votes';

const apis = {
  votes: {
    apiUtil: (network, params) => getVotes({ network, params }),
    getApiParams: state => ({ address: state.account.summary?.address }),
    defaultData: [],
    autoload: false,
    transformResponse: response => response.data,
  },
  accounts: {
    apiUtil: (network, params) => getAccounts({ network, params }),
    autoload: false,
    defaultData: {},
    transformResponse: response =>
      response.data.reduce((dict, account) => {
        dict[account.summary?.address] = account;
        return dict;
      }, {}),
  },
};

const mapStateToProps = state => ({
  hostVotes: state.voting,
  isDelegate: state.account?.info?.LSK?.isDelegate,
});

export default compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Votes);
