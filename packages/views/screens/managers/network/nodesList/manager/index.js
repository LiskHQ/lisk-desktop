import { compose } from 'redux';
import { getPeers } from "@network/utilities/api";
import withData from "@common/utilities/withData";
import { withTranslation } from "react-i18next";
import withLocalSort from "@common/utilities/withLocalSort";
import { sortByVersion } from '../../utilities/helpers';
import NodeList from "./manager";

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
)(NodeList);