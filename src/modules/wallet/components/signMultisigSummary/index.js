import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigTransactionSigned } from 'src/redux/actions';
import { getAccount } from '@wallet/utils/api';
import withData from 'src/utils/withData';
import { withRouter } from 'react-router';
import { selectActiveToken } from 'src/redux/selectors';
import Summary from './summary';

const apis = {
  senderAccount: {
    apiUtil: (network, { token, publicKey }) =>
      getAccount({ network, params: { publicKey } }, token),
    getApiParams: (state, ownProps) => ({
      publicKey: ownProps.transaction.sender.publicKey,
      network: state.network,
    }),
    autoload: true,
  },
};

const mapStateToProps = (state) => ({
  account: {
    ...state.wallet.info.LSK,
    passphrase: state.passphrase,
    hwInfo: state.hwInfo,
  },
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
  withTranslation()
)(Summary);
