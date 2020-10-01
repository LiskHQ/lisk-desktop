// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DelegateProfile from './delegateProfile';
import withData from '../../../../utils/withData';
import { getAPIClient } from '../../../../utils/api/lsk/network';

const mapStateToProps = state => ({
  awaitingForgers: state.blocks.awaitingForgers,
  forgingTimes: state.blocks.forgingTimes,
});

const apis = {
  delegate: {
    apiUtil: (liskAPIClient, params) => getAPIClient(liskAPIClient).delegates.get(params),
    defaultData: {},
    getApiParams: (_, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => (response.data[0] ? response.data[0] : {}),
  },
  voters: {
    // apiUtil: (liskAPIClient, params) => getAPIClient(liskAPIClient).voters.get(params),
    apiUtil: (liskAPIClient, params) => (new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: Array.from(Array(10).keys()).map(item => `5447926331525636${item + (params.offset || 0)}L`),
          meta: { count: 1000, offset: (params.offset || 0) },
        });
      }, 50);
    })),
    defaultData: [],
    getApiParams: (_, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => (response ? response.data : []),
  },
  lastBlockForged: {
    apiUtil: (liskAPIClient, params) => getAPIClient(liskAPIClient).blocks.get(params),
    defaultData: {},
    getApiParams: state => ({
      height: state.account.info.LSK.delegate.lastForgedHeight,
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
