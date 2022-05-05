/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getBlocks } from '@block/utils';
import withData from 'src/utils/withData';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import BlocksOverview from '../components/blocksOverview';

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
