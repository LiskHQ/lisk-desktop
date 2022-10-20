import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigTransactionSigned } from 'src/redux/actions';
import { getAccount } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import { withRouter } from 'react-router';
import { selectActiveToken, selectActiveTokenAccount } from 'src/redux/selectors';
import { extractAddressFromPublicKey } from '../../utils/account';

import Summary from './summary';

const apis = {
  senderAccount: {
    apiUtil: (network, { token, address }) =>
      getAccount({ network, params: { address } }, token),
    getApiParams: (state, ownProps) => ({
      address: extractAddressFromPublicKey(ownProps.transactionJSON.senderPublicKey),
      network: state.network,
    }),
    autoload: true,
  },
};

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
  network: state.network,
  activeToken: selectActiveToken(state),
  networkIdentifier: state.network.networks.LSK.networkIdentifier,
});

const dispatchToProps = {
  multisigTransactionSigned,
};

export default compose(
  connect(mapStateToProps, dispatchToProps),
  withRouter,
  withData(apis),
  withTranslation(),
)(Summary);
