import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from '@common/store';
import Status from './unlockBalanceStatus';

const mapStateToProps = state => ({
  transactions: state.transactions,
  account: selectActiveTokenAccount(state),
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(Status);
