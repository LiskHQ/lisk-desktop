/* istanbul ignore file */
import { connect } from 'react-redux';
import { followedAccountAdded, followedAccountRemoved } from '../../actions/followedAccounts';
import FollowAccount from './followAccount';

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = {
  followedAccountAdded,
  followedAccountRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowAccount);
