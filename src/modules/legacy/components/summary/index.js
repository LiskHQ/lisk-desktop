// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectActiveTokenAccount } from '@common/store';
import { withTranslation } from 'react-i18next';
import { balanceReclaimed } from '@legacy/store/action';
import Summary from './summary';

const mapStateToProps = state => ({
  wallet: selectActiveTokenAccount(state),
  network: state.network,
});

const dispatchToProps = {
  balanceReclaimed,
};

export default compose(
  connect(mapStateToProps, dispatchToProps),
  withTranslation(),
)(Summary);
