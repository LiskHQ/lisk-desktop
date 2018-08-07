import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import { activePeerSet } from '../../actions/peers';
import NewsFeed from './newsFeed';


const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

const mapStateToProps = state => ({
  channels: state.settings.channels || {
    academy: false,
    twitter: true,
    blog: false,
    github: false,
    reddit: false,
  },
  newsFeed: state.news.messages,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(NewsFeed));
