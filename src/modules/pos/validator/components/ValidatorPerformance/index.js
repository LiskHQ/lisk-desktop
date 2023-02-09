/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { getValidator } from '@pos/validator/api';
import withData from 'src/utils/withData';
import { parseSearchParams } from 'src/utils/searchParams';
import ValidatorPerformance from './ValidatorPerformance';

const apis = {
  validator: {
    apiUtil: (network, { address }) => getValidator({ network, params: { address } }),
    getApiParams: (state, ownProps) => ({
      address: parseSearchParams(ownProps.location.search).address,
      network: state.network,
    }),
    transformResponse: (response) => response.data[0] || {},
    autoload: true,
  },
};

export default compose(withRouter, withData(apis), withTranslation())(ValidatorPerformance);
