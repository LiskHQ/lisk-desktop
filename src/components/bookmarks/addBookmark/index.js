/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bookmarkAdded } from '../../../actions/bookmarks';
import { getAccount } from '../../../utils/api/lsk/account';
import AddBookmark from './addBookmark';
import withData from '../../../utils/withData';

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  token: state.settings.token,
  network: state.network,
});

const mapDispatchToProps = {
  bookmarkAdded,
};

export default connect(mapStateToProps, mapDispatchToProps)(withData({
  account: {
    apiUtil: (liskAPIClient, params) => getAccount({ liskAPIClient, ...params }),
  },
})(translate()(AddBookmark)));
