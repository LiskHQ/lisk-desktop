import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useTokensBalance, useTokensTopLskBalance } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = () => {
  const [params, setParams] = useState({ sort: 'balance:desc' });
  const { t } = useTranslation();
  const { data: tokens } = useTokensBalance();
  const token = tokens?.data?.[0] || {};

  return (
    <QueryTable
      showHeader
      queryHook={useTokensTopLskBalance}
      queryConfig={{ config: { params } }}
      setParams={setParams}
      row={WalletRow}
      additionalRowProps={{ token }}
      header={header(t)}
    />
  );
};

export default WalletTable;
