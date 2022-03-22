// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getNews } from '@common/utilities/api/market';
import withData from '@utils/withData';
import NewsFeed from './newsFeed';

export default withData({
  newsFeed: {
    autoload: false,
    apiUtil: (network, params) => getNews({ network, params }),
    defaultData: [],
    transformResponse: response => response.data,
  },
})(withTranslation()(NewsFeed));
