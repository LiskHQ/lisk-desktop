// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getNews } from '../../../../utils/api/market';
import withData from '../../../../utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: getNews,
    defaultData: [],
  },
})(withTranslation()(NewsFeed));
