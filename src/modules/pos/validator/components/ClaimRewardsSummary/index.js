/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import ClaimRewardsSummary from './ClaimRewardsSummary';

const mapStateToProps = (state) => ({
  wallet: selectActiveTokenAccount(state),
});

export default connect(mapStateToProps)(withTranslation()(ClaimRewardsSummary));
