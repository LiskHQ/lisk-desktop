/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { isVotingTxPending } from '@utils/voting';
import { getActiveTokenAccount } from '@utils/account';
import Editor from './editor';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  votes: state.voting,
  pendingVotingTx: isVotingTxPending(state),
});

export default connect(
  mapStateToProps,
)(withTranslation()(Editor));
