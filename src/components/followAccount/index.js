/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { followedAccountAdded, followedAccountRemoved } from '../../actions/followedAccounts';
import FollowAccount from './followAccount';

const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts,
});

const mapDispatchToProps = {
  followedAccountAdded,
  followedAccountRemoved,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(FollowAccount));
