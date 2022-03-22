/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { bookmarkRemoved, bookmarkUpdated } from '@common/store/actions';
import BookmarkListModal from './modal';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

const mapDispatchToProps = {
  bookmarkRemoved,
  bookmarkUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BookmarkListModal));
