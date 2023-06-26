import React from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useTokensTopLskBalance } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = ({ token, filters }) => {
  const { t } = useTranslation();
  const tokenID = token?.tokenID;

  return (
    <QueryTable
      showHeader
      queryHook={useTokensTopLskBalance}
      queryConfig={{ config: { params: filters }, options: { enabled: !!tokenID } }}
      transformResponse={(res) => res?.[tokenID]}
      row={WalletRow}
      additionalRowProps={{ token }}
      header={header(t)}
    />
  );
};

export default WalletTable;
