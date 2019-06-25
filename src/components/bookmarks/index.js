/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Bookmarks from './bookmarks';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

export default connect(mapStateToProps)(translate()(Bookmarks));
