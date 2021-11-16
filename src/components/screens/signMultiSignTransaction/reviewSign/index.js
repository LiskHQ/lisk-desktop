import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@utils/account';
import { getAccount } from '@api/account';
import withData from '@utils/withData';
import { withRouter } from 'react-router';
import ReviewSignComp from './reviewSign';

const ReviewSign = (props) => {
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  const account = useSelector(getActiveTokenAccount);

  return (
    <ReviewSignComp
      t={t}
      {...props}
      networkIdentifier={network.networks.LSK.networkIdentifier}
      account={account}
      network={network}
    />
  );
};

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

export default compose(
  withRouter,
  withData(apis),
)(ReviewSign);
