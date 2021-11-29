/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import ResultComponent from './result';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  transactions: state.transactions,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(ResultComponent);
