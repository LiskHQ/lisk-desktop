/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getBlocks } from '@api/block';
import withData from '@utils/withData';
import { transformStringDateToUnixTimestamp } from '@utils/datetime';
import Blocks from './blocks';

const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    switch (item) {
      case 'dateFrom':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/(\d+)?:/, `${transformStringDateToUnixTimestamp(params[item])}:`);
        break;
      case 'dateTo':
        if (!acc.timestamp) acc.timestamp = ':';
        acc.timestamp = acc.timestamp.replace(/:(\d+)?/, `:${transformStringDateToUnixTimestamp(params[item])}`);
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
