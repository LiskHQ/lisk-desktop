import React from 'react';
import { useCurrentAccount } from '../../hooks';
import RemoveAccount from '../RemoveAccount/RemoveAccount';

const RemoveCurrentAccountFlow = () => {
  const [account] = useCurrentAccount();
  const { address } = account.metadata;
  return (
    <RemoveAccount address={address} />
  );
};

export default RemoveCurrentAccountFlow;
