import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '../../../../utils/account';
import { unlockBalanceSubmitted } from '../../../../actions/account';
import LockedBalance from './lockedBalance';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  token: state.settings.token.active,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  unlockBalanceSubmitted,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(LockedBalance));
