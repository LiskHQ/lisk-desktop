/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { searchAccount } from '../../../actions/search';
import { bookmarkAdded } from '../../../actions/bookmarks';
import AddBookmark from './addBookmark';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
  network: state.network,
  accounts: state.search.accounts,
});

const mapDispatchToProps = {
  searchAccount,
  bookmarkAdded,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddBookmark));
