/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bookmarkAdded } from '../../actions/bookmarks';
import AddAccountTitle from './addAccountTitle';

const mapStateToProps = (state, ownProps) => ({
  account: state.search.accounts[ownProps.address],
  accounts: state.bookmarks,
});

const mapDispatchToProps = {
  addAccount: bookmarkAdded,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddAccountTitle));
