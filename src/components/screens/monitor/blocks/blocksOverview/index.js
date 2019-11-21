/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BlocksOverview from './blocksOverview';
import liskService from '../../../../../utils/api/lsk/liskService';
import withData from '../../../../../utils/withData';

export default compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: liskService.getLastBlocks,
      defaultUrlSearchParams: { limit: '10' },
      defaultData: [],
      autoload: true,
    },
  }),
)(BlocksOverview);
