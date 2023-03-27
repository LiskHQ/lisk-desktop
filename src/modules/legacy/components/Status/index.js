import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Status from './Status';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  network: state.network,
  account: selectActiveTokenAccount(state),
});

export default compose(connect(mapStateToProps), withTranslation())(Status);
