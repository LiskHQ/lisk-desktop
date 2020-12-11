// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getVotes } from '../../../../utils/api/delegate';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import Votes from './votes';

const apis = {
  votes: {
    apiUtil: getVotes,
    defaultData: [],
    autoload: false,
    transformResponse: response => response.data.votes,
  },
  accounts: {
    apiUtil: liskService.getAccounts,
    autoload: false,
    defaultData: {},
    transformResponse: response =>
      response.data.reduce((dict, account) => {
        dict[account.address] = account;
        return dict;
      }, {}),
  },
};

const mapStateToProps = state => ({
  hostVotes: state.voting,
  isDelegate: state.account && state.account.info && state.account.info.LSK.isDelegate,
});

export default compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(Votes);
