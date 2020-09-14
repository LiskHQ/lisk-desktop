// istanbul ignore file
import { withTranslation } from 'react-i18next';
import DelegateProfile from './delegateProfile';
import withData from '../../../../utils/withData';
import { getAPIClient } from '../../../../utils/api/lsk/network';

const apis = {
  delegate: {
    apiUtil: (liskAPIClient, params) => getAPIClient(liskAPIClient).delegates.get(params),
    defaultData: {},
    getApiParams: (state, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => (response.data[0] ? response.data[0] : {}),
  },
  voters: {
    apiUtil: (liskAPIClient, params) => getAPIClient(liskAPIClient).voters.get(params),
    defaultData: {},
    getApiParams: (state, ownProps) => ({
      address: ownProps.address,
    }),
    transformResponse: response => response,
  },
};

export default withData(apis)(withTranslation()(DelegateProfile));
