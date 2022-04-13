import React from 'react';

import WalletRow from '@wallet/list/row';
import Table from '@basics/table';
import { DEFAULT_LIMIT } from '@views/configuration';
import header from './tableHeader';

const WalletTable = ({
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
      row={WalletRow}
      loadData={handleLoadMore}
      header={header(t)}
      additionalRowProps={{ supply }}
      error={wallets.error}
      canLoadMore={canLoadMore}
    />
  );
};

export default WalletTable;
