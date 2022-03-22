/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { balanceUnlocked } from '@common/store/actions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  balanceUnlocked,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withTranslation()(Summary));
