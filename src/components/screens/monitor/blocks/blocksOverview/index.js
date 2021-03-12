/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BlocksOverview from './blocksOverview';
import { getBlocks } from 'utils/api/block';
import withData from 'utils/withData';

export default compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: (network, params) => getBlocks({ network, params }),
      transformResponse: response => response.data,
      defaultUrlSearchParams: { limit: '10' },
      defaultData: [],
      autoload: true,
    },
  }),
)(BlocksOverview);
