import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getActiveTokenAccount } from '../../../../utils/account';
import LockedBalance from './lockedBalance';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  token: state.settings.token.active,
  availableTokens: 150, // TODO conect with redux state
});

const mapDispatchToProps = {
  // TODO conect with the correct redux action once it is created
  transactionCreated: data => ({
    type: 'undefined',
    data,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(LockedBalance));
