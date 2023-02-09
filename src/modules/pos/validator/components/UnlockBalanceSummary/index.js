/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { balanceUnlocked } from '@pos/validator/store/actions/staking';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Summary from './UnlockBalanceSummary';

const mapStateToProps = (state) => ({
  wallet: selectActiveTokenAccount(state),
  network: state.network,
});

const mapDispatchToProps = {
  balanceUnlocked,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary));
