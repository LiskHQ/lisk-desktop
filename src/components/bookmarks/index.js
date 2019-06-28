/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bookmarkRemoved, bookmarkUpdated } from '../../actions/bookmarks';
import Bookmarks from './bookmarks';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
});

const mapDispatchToProps = {
  bookmarkRemoved,
  bookmarkUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Bookmarks));
