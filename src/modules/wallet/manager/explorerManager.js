/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from 'src/utils/withData';
import { getAccount } from '@wallet/utils/api';
import { selectSearchParamValue } from 'src/utils/searchParams';
import ExplorerLayout from 'src/modules/wallet/components/ExplorerLayout';

const apis = {
  account: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    defaultData: {},
    getApiParams: (state, props) => ({
      address: selectSearchParamValue(props.history.location.search, 'address'),
      network: state.network,
    }),
    transformResponse: (response) => response,
  },
};

export default compose(withData(apis), withTranslation())(ExplorerLayout);
