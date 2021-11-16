/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { tokensUnlocked } from '@actions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
  currentBlockHeight: state.blocks.latestBlocks[0].height,
});

const mapDispatchToProps = {
  tokensUnlocked,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withTranslation()(Summary));
