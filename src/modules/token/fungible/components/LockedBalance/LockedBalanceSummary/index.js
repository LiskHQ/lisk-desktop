/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { balanceUnlocked } from '@packages/wallet/store/action';
import { getActiveTokenAccount } from '@wallet/utils/account';
import Summary from './LockedBalanceSummary';

const mapStateToProps = state => ({
  wallet: getActiveTokenAccount(state),
  network: state.network,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  balanceUnlocked,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withTranslation()(Summary));
