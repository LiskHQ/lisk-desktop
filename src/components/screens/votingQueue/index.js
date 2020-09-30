/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../utils/account';
import VotingQueue from './votingQueue';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

export default connect(
  mapStateToProps,
)(withTranslation()(VotingQueue));
