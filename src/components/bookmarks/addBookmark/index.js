/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import AddBookmark from './addBookmark';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
  network: state.network,
});

export default connect(mapStateToProps)(translate()(AddBookmark));
