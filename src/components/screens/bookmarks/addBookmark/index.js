/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { bookmarkAdded, bookmarkUpdated, bookmarkRemoved } from '../../../../actions/bookmarks';
import AddBookmark from './addBookmark';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
  network: state.network,
});

const mapDispatchToProps = {
  bookmarkAdded,
  bookmarkUpdated,
  bookmarkRemoved,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(AddBookmark);
