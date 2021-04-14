// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getNews } from '@api/market';
import withData from '@utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: (_, params) => getNews({ params }),
    defaultData: [],
    transformResponse: response => response.data,
  },
})(withTranslation()(NewsFeed));
