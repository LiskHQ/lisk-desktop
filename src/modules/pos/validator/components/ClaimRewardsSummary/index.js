/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { claimedRewards } from '@pos/validator/store/actions/staking';
import ClaimRewardsSummary from './ClaimRewardsSummary';

const mapStateToProps = (state) => ({
  wallet: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  claimedRewards,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ClaimRewardsSummary));
