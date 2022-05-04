import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getPeers } from '@network/utils/api';
import withData from 'src/utils/withData';
import { DEFAULT_LIMIT } from '@views/configuration';
import withLocalSort from 'src/utils/withLocalSort';
import { tokenMap } from '@token/fungible/consts/tokens';
import sortByVersion from '../utils/helpers';
import NetworkMonitorView from '../components/networkMonitorView';

export default compose(
  withData({
    peers: {
      apiUtil: (network, params) => getPeers({ network, params }, tokenMap.LSK.key),
      getApiParams: () => ({
        limit: DEFAULT_LIMIT,
      }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, peers, urlSearchParams) => (
        urlSearchParams.offset
          ? [...peers, ...response.data]
          : response.data
      ),
    },
  }),
  withLocalSort('peers', 'height:desc', { networkVersion: sortByVersion }),
  withTranslation(),
)(NetworkMonitorView);
