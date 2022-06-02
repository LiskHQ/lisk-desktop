/* istanbul ignore file */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from '@common/store';
import Status from './status';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
  transactions: state.transactions,
});

export default compose(
  connect(mapStateToProps),
  withTranslation(),
)(Status);
