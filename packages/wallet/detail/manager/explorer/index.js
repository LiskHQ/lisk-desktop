/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '@common/utilities/withData';
import { getAccount } from '@wallet/utilities/api';
import { selectSearchParamValue } from '@screens/router/searchParams';
import ExplorerLayout from '@screens/managers/wallet/explorerLayout';

const apis = {
  account: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    defaultData: {},
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: selectSearchParamValue(props.history.location.search, 'address'),
      network: state.network,
    }),
    transformResponse: response => response,
  },
};

export default compose(
  withData(apis),
  withTranslation(),
)(ExplorerLayout);
