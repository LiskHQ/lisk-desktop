// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getVotes } from '@dpos/validator/utiles/api';
import { getAccounts } from '@wallet/utilities/api';
import withData from '@common/utilities/withData';
import Votes from './votes';

const apis = {
  votes: {
    apiUtil: (network, params) => getVotes({ network, params }),
    defaultData: [],
    autoload: false,
    transformResponse: response => response.data?.votes ?? [],
  },
  accounts: {
    apiUtil: (network, params) => getAccounts({ network, params }),
    autoload: false,
    defaultData: {},
    transformResponse: response =>
      response.data.reduce((dict, account) => {
        dict[account.summary.address] = account;
        return dict;
      }, {}),
  },
};

const mapStateToProps = state => ({
  sentVotes: state.voting,
  isDelegate: state.wallet?.info?.LSK?.summary.isDelegate,
});

export default compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Votes);
