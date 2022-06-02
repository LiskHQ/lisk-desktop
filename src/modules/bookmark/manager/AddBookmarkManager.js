/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { bookmarkAdded, bookmarkUpdated, bookmarkRemoved } from '@common/store/actions';
import { getAccount } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import { selectSearchParamValue } from 'src/utils/searchParams';
import AddBookmark from '../components/AddBookmark';

const mapStateToProps = state => ({
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withData({
    account: {
      apiUtil: (network, params) => getAccount({ network, params }),
      defaultData: {},
      getApiParams: (state, props) => ({
        address: selectSearchParamValue(props.history.location.search, 'address'),
      }),
    },
  }),
  withTranslation(),
)(AddBookmark);
