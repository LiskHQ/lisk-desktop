import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigTransactionSigned } from 'src/redux/actions';
import { withRouter } from 'react-router';
import { selectActiveTokenAccount } from 'src/redux/selectors';

import Summary from './summary';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  network: state.network,
  networkIdentifier: state.network.networks.LSK.networkIdentifier,
});

const dispatchToProps = {
  multisigTransactionSigned,
};

export default compose(
  connect(mapStateToProps, dispatchToProps),
  withRouter,
  withTranslation()
)(Summary);
