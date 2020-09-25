import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '../../../../utils/account';
import { transactionCreated } from '../../../../actions/transactions';
import LockedBalance from './lockedBalance';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  token: state.settings.token.active,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  transactionCreated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(LockedBalance));
