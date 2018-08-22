import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Bookmark from './bookmark';

/**
 * Passing state
 */
const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts.accounts,
});

export default connect(mapStateToProps)(translate()(Bookmark));
