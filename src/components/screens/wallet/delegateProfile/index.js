// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withData from '@utils/withData';
import { getVoters } from '@utils/api/delegate';
import { getBlocks } from '@utils/api/block';
import DelegateProfile from './delegateProfile';

const mapStateToProps = state => ({
  awaitingForgers: state.blocks.awaitingForgers,
  forgingTimes: state.blocks.forgingTimes,
});

const apis = {
  voters: {
    apiUtil: (network, params) => getVoters({ network, params }),
    defaultData: [],
    getApiParams: (_, ownProps) => ({ address: ownProps.account.summary.address }),
    transformResponse: response => (response.data.votes ?? []),
  },
  lastBlockForged: {
    apiUtil: (network, params) => getBlocks({ network, params }),
    defaultData: {},
    transformResponse: response => (response ? response.data[0] : {}),
  },
};

const ComposedDelegateProfile = compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(DelegateProfile);

export default ComposedDelegateProfile;
