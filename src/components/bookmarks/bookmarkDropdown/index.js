/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { bookmarkAdded, bookmarkRemoved } from '../../../actions/bookmarks';
import BookmarkDropdown from './bookmarkDropdown';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BookmarkDropdown));
