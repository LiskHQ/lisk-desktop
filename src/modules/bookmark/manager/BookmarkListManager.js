/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { bookmarkRemoved, bookmarkUpdated } from 'src/redux/actions';
import BookmarkListModal from '@bookmark/components/BookmarksListModal';

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
  token: state.token,
});

const mapDispatchToProps = {
  bookmarkRemoved,
  bookmarkUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BookmarkListModal));
