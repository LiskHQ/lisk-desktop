// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DelegateProfile from './delegateProfile';
import withData from 'utils/withData';
import { getDelegates, getVoters } from 'utils/api/delegate';
import { getBlocks } from 'utils/api/block';

const mapStateToProps = state => ({
  awaitingForgers: state.blocks.awaitingForgers,
  forgingTimes: state.blocks.forgingTimes,
});

const apis = {
  delegate: {
    apiUtil: (network, params) => getDelegates({ network, params }),
    defaultData: {},
    getApiParams: (_, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => (response.data[0] ? response.data[0] : {}),
  },
  voters: {
    apiUtil: (network, params) => getVoters({ network, params }),
    defaultData: [],
    getApiParams: (_, ownProps) => ({
      address: ownProps.address,
    }),
  },
  lastBlockForged: {
    apiUtil: (network, params) => getBlocks({ network, params }),
    defaultData: {},
    getApiParams: state => ({
      height: state.account.info && state.account.info.LSK.delegate
        ? state.account.info.LSK.delegate.lastForgedHeight : 0,
    }),
    transformResponse: response => (response ? response.data[0] : {}),
  },
};

const ComposedDelegateProfile = compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(DelegateProfile);

export default ComposedDelegateProfile;
