import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import { getNewsFeed } from '../../actions/liskService';
import { channels } from '../../store/reducers/settings';
import NewsFeed from './newsFeed';


const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  getNewsFeed: () => dispatch(getNewsFeed()),
});

const mapStateToProps = state => ({
  channels: state.settings.channels || channels,
  newsFeed: state.liskService.newsFeed || [],
  showNewsFeedEmptyState: state.liskService.showNewsFeedEmptyState,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(NewsFeed));
