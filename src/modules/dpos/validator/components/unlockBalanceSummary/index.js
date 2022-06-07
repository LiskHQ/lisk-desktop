/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { balanceUnlocked } from '@dpos/validator/store/actions/voting';
import { selectActiveTokenAccount } from '@common/store';
import Summary from './unlockBalanceSummary';

const mapStateToProps = state => ({
  wallet: selectActiveTokenAccount(state),
  network: state.network,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  balanceUnlocked,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withTranslation()(Summary));
