/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getBlocks } from '@api/block';
import withData from '@utils/withData';
import { DEFAULT_LIMIT } from '@constants';
import BlocksOverview from './blocksOverview';

export default compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: (network, params) => getBlocks({ network, params }),
      transformResponse: response => response.data,
      defaultUrlSearchParams: { limit: DEFAULT_LIMIT },
      defaultData: [],
      autoload: true,
    },
  }),
)(BlocksOverview);
