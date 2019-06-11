/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import BookmarksList from './bookmarksList';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

export default connect(mapStateToProps)(translate()(BookmarksList));
