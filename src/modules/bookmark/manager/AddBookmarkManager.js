/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { bookmarkAdded, bookmarkUpdated, bookmarkRemoved } from 'src/redux/actions';
import { getAccount } from '@wallet/utils/api';
import withData from 'src/utils/withData';
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withData({
    account: {
      apiUtil: (network, params) => getAccount({ network, params }),
      defaultData: {},
    },
  })
)(AddBookmark);
