/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Blocks from './blocks';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';

export default compose(
  withRouter,
  withData({
    blocks: {
      apiUtil: liskService.getLastBlocks,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.filter(block => !oldData.find(({ id }) => id === block.id))]
          : response
      ),
    },
  }),
  withTranslation(),
)(Blocks);
