// istanbul ignore file
import { withTranslation } from 'react-i18next';
import liskServiceApi from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: liskServiceApi.getNewsFeed,
    defaultData: [],
  },
})(withTranslation()(NewsFeed));
