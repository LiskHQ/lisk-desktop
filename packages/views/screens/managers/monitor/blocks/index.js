/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getBlocks } from '@block/utilities/api';
import withData from '@common/utilities/withData';
import { transformStringDateToUnixTimestamp } from '@views/configuration/dateTime';
import { DEFAULT_LIMIT } from '@views/configuration';
import Blocks from './blocks';

const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          acc.timestamp = acc.timestamp
            .replace(/(\d+)?:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        }
        break;
      case 'dateTo':
        if (params[item]) {
          if (!acc.timestamp) acc.timestamp = ':';
          // We add 86400 so the range is inclusive
          acc.timestamp = acc.timestamp
            .replace(/:(\d+)?/, `:${transformStringDateToUnixTimestamp(params[item]) + 86400}`);
        }
        break;
      default:
        acc[item] = params[item];
    }

    return acc;
  }, {});

const ComposedBlocks = compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: (network, params) =>
        getBlocks({ network, params: transformParams(params) }),
      getApiParams: () => ({
        limit: DEFAULT_LIMIT,
      }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(Blocks);

export default ComposedBlocks;
