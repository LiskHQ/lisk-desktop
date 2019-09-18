/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bookmarkAdded, bookmarkRemoved, bookmarkUpdated } from '../../../actions/bookmarks';
import BookmarkDropdown from './bookmarkDropdown';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkRemoved,
  bookmarkUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(BookmarkDropdown));
