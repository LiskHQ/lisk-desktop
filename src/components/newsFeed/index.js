import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import { channels } from '../../store/reducers/settings';
import NewsFeed from './newsFeed';


const mapDispatchToProps = dispatch => ({
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

const mapStateToProps = state => ({
  channels: state.settings.channels || channels,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(NewsFeed));
