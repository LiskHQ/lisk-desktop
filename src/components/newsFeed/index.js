// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { channels } from '../../store/reducers/settings';
import liskServiceApi from '../../utils/api/lsk/liskService';
import withData from '../../utils/withData';
import NewsFeed from './newsFeed';

const mapStateToProps = state => ({
  channels: (state.settings && state.settings.channels) || channels,
});

export default connect(mapStateToProps)(withData({
  newsFeed: {
    autoload: true,
    apiUtil: liskServiceApi.getNewsFeed,
    defaultData: [],
  },
})(withTranslation()(NewsFeed)));
