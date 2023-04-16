import React from 'react';
import { withRouter } from 'react-router';
import RemoveAccount from '../RemoveAccount/RemoveAccount';
import { useCurrentAccount } from '../../hooks';

const RemoveSelectedAccountFlow = () => {
  const [currentAccount] = useCurrentAccount();

  return <RemoveAccount account={currentAccount} />;
};

export default withRouter(RemoveSelectedAccountFlow);
