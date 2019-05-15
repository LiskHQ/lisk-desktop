/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { followedAccountAdded } from '../../actions/followedAccounts';
import AddAccountTitle from './addAccountTitle';

const mapStateToProps = (state, ownProps) => ({
  account: state.search.accounts[ownProps.address],
  accounts: state.followedAccounts,
});

const mapDispatchToProps = {
  addAccount: followedAccountAdded,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddAccountTitle));
