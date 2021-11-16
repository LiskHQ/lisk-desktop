/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { delegateRegistered } from '@actions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
});

const mapDispatchToProps = {
  delegateRegistered,
};

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withTranslation()(Summary));
