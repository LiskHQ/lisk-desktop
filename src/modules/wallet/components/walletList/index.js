import React from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useTokensTopLskBalance } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = ({ token, tokenSummary, filters }) => {
  const { t } = useTranslation();
  const { sort, toggleSort } = useSort({ defaultSort: 'balance:desc' });
  const tokenID = token?.tokenID;
  const tokenSupply = tokenSummary?.data?.totalSupply?.filter(
    (tokenData) => tokenData.tokenID === tokenID
  )[0];

  return (
    <QueryTable
      showHeader
      queryHook={useTokensTopLskBalance}
      queryConfig={{
        config: { params: { ...filters, ...(sort && { sort }) } },
        options: { enabled: !!tokenID },
      }}
      transformResponse={(res) => res?.[tokenID]}
      row={WalletRow}
      additionalRowProps={{ token, tokenSupply }}
      header={header(t, toggleSort)}
    />
  );
};

export default WalletTable;
