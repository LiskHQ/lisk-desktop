import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigTransactionSigned } from '@actions';
import { getAccount } from '@api/account';
import withData from '@utils/withData';
import { withRouter } from 'react-router';
import Summary from './summary';

const apis = {
  senderAccount: {
    apiUtil: (network, { token, publicKey }) =>
      getAccount({ network, params: { publicKey } }, token),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      publicKey: ownProps.transaction.sender.publicKey,
      network: state.network,
    }),
    autoload: true,
  },
};

const mapStateToProps = state => ({
  account: {
    ...state.account.info.LSK,
    passphrase: state.passphrase,
    hwInfo: state.hwInfo,
  },
  network: state.network,
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
