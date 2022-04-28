/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getDelegate } from '@dpos/utilities/api';
import withData from '@common/utilities/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import { withTranslation } from 'react-i18next';
import DelegatePerformance from './delegatePerformance';

const apis = {
  delegate: {
    apiUtil: (network, { address }) =>
      getDelegate({ network, params: { address } }),
    getApiParams: (state, ownProps) => ({
      address: parseSearchParams(ownProps.location.search).address,
      network: state.network,
    }),
    transformResponse: response => response.data[0] || {},
    autoload: true,
  },
};

export default compose(
  withRouter,
  withData(apis),
  withTranslation(),
)(DelegatePerformance);
