/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getBlocks } from '@utils/api/block';
import withData from '@utils/withData';
import BlocksOverview from './blocksOverview';

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
