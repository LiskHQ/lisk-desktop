import { connect } from 'react-redux';
import { followedAccountAdded, followedAccountRemoved } from '../../actions/followedAccounts';
import FollowAccount from './followAccount';

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
  removeAccount: data => dispatch(followedAccountRemoved(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowAccount);
