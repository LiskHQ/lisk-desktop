// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getNews } from 'src/utils/api/market';
import withData from 'src/utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: (network, params) => getNews({ network, params }),
    defaultData: [],
    transformResponse: (response) => response.data,
  },
})(withTranslation()(NewsFeed));
