// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getVotes, getDelegates } from '../../../../utils/api/delegate';
import withData from '../../../../utils/withData';
import Votes from './votes';

const apis = {
  votes: {
    apiUtil: (network, params) => getVotes({ network, params }),
    getApiParams: state => ({ address: state.account.address }),
    defaultData: [],
    autoload: false,
    transformResponse: response => response.data || response.data.data,
  },
  delegates: {
    apiUtil: (network, params) => getDelegates({ network, params }),
    defaultData: [],
    transformResponse: response => response[0].result.data,
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
