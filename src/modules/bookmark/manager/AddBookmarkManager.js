/* istanbul ignore file */
import { connect } from 'react-redux';
import { bookmarkAdded, bookmarkRemoved, bookmarkUpdated } from 'src/redux/actions';
import AddBookmark from '../components/AddBookmark';

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
  token: state.token,
  network: state.network,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkUpdated,
  bookmarkRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBookmark);
