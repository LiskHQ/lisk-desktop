/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import BookmarksList from './bookmarksList';

const mapStateToProps = state => {
  console.log(state);
  return {
    bookmarks: state.bookmarks,
    token: state.settings.token,
  }
};

export default connect(mapStateToProps)(withTranslation()(BookmarksList));
