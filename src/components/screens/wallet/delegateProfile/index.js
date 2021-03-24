// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withData from '@utils/withData';
import { getVoters } from '@utils/api/delegate';
import { getAccount } from '@utils/api/account';
import { getBlocks } from '@utils/api/block';
import { tokenMap } from '@constants';
import DelegateProfile from './delegateProfile';

const mapStateToProps = state => ({
  awaitingForgers: state.blocks.awaitingForgers,
  forgingTimes: state.blocks.forgingTimes,
});

const apis = {
  delegate: {
    apiUtil: (network, params) =>
      getAccount({ network, params }, tokenMap.LSK.key),
    defaultData: {},
    getApiParams: (_, ownProps) => ({
      address: ownProps.address,
      isDelegate: true,
    }),
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
    transformResponse: response => (response ? response.data[0] : {}),
  },
};

const ComposedDelegateProfile = compose(
  connect(mapStateToProps),
  withData(apis),
  withTranslation(),
)(DelegateProfile);

export default ComposedDelegateProfile;
