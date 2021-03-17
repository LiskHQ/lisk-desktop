/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { bookmarkAdded, bookmarkRemoved, bookmarkUpdated } from '@actions';
import BookmarkDropdown from './bookmarkDropdown';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkRemoved,
  bookmarkUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BookmarkDropdown));
