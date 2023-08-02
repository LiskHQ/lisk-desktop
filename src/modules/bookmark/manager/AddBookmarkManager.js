/* istanbul ignore file */
import { connect } from 'react-redux';
import { bookmarkAdded } from 'src/redux/actions';
import AddBookmark from '../components/AddBookmark';

const mapStateToProps = (state) => ({
  bookmarks: state.bookmarks,
  token: state.token,
});

const mapDispatchToProps = {
  bookmarkAdded,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBookmark);
