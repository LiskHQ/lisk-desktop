/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bookmarkAdded, bookmarkRemoved } from '../../actions/bookmarks';
import Bookmark from './bookmark';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Bookmark));
