import React from 'react';

import AccountRow from '@wallet/list/row';
import Table from '@basics/table';
import { DEFAULT_LIMIT } from '@views/configuration';
import header from './tableHeader';

export const WalletTable = ({
  wallets,
  networkStatus,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    wallets.loadData({ offset: wallets.meta.count + wallets.meta.offset });
  };
  const supply = networkStatus.data.supply;
  const canLoadMore = wallets.meta ? wallets.meta.count === DEFAULT_LIMIT : false;

  return (
    <Table
      data={wallets.data}
      isLoading={wallets.isLoading}
      row={AccountRow}
      loadData={handleLoadMore}
      header={header(t)}
      additionalRowProps={{ supply }}
      error={accounts.error}
      canLoadMore={canLoadMore}
    />
  );
};

export default WalletTable
