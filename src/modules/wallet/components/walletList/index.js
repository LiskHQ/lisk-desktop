import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useTokensTopLskBalance } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = () => {
  const [params, setParams] = useState({ sort: 'balance:desc' });
  const { t } = useTranslation();

  return (
    <QueryTable
      showHeader
      queryHook={useTokensTopLskBalance}
      queryConfig={{ config: { params } }}
      setParams={setParams}
      row={WalletRow}
      header={header(t)}
    />
  );
};

export default WalletTable;
