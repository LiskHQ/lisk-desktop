import { compose } from 'redux';
import withData from "@common/utilities/withData";
import { withTranslation } from "react-i18next";
import Statistics from './statistics';
import { getNetworkStatistics } from '@network/utilities/api';
import { tokenMap } from '@token/configuration/tokens';

export default compose(
  withData({
    networkStatistics: {
      apiUtil: network => getNetworkStatistics({ network }, tokenMap.LSK.key),
      defaultData: {},
      autoload: true,
      transformResponse: response => response.data,
    },
  }),
  withTranslation(),
  )(Statistics);