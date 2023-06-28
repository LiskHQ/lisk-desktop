import React from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useTokensTopLskBalance } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = ({ token, tokenSummary, filters }) => {
  const { t } = useTranslation();
  const tokenID = token?.tokenID;
  const tokenSupply = tokenSummary?.data?.totalSupply?.filter(
    (tokenData) => tokenData.tokenID === tokenID
  )[0];

  return (
    <QueryTable
      showHeader
      queryHook={useTokensTopLskBalance}
      queryConfig={{ config: { params: filters }, options: { enabled: !!tokenID } }}
      transformResponse={(res) => res?.[tokenID]}
      row={WalletRow}
      additionalRowProps={{ token, tokenSupply }}
      header={header(t)}
    />
  );
};

export default WalletTable;
