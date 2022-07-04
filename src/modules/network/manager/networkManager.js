import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getPeers } from '@network/utils/api';
import withData from 'src/utils/withData';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import withLocalSort from 'src/utils/withLocalSort';
import sortByVersion from '../utils/helpers';
import NetworkMonitorView from '../components/networkMonitorView';

export default compose(
  withData({
    peers: {
      apiUtil: (network, params) => getPeers({ network, params }),
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
