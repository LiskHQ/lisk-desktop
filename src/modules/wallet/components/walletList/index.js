import React from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useTokensBalanceTop } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = ({ token, tokenSummary, filters }) => {
  const { t } = useTranslation();
  const { sort, toggleSort } = useSort({ defaultSort: 'balance:desc' });
  const tokenID = token?.tokenID;
  const tokenSupply = tokenSummary?.data?.totalSupply?.filter(
    (tokenData) => tokenData.tokenID === tokenID
  )[0];

  const fetchNextPage = (data) =>
    data.pages.reduce((prevPages, page) => {
      const dataKeys = Object.keys(page?.data ?? {});
      const newData = page?.data || [];
      const merge = prevPages.data
        ? dataKeys.reduce(
            (acc, key) => ({
              ...acc,
              [key]: [...prevPages.data[key], ...newData[key]],
            }),
            {}
          )
        : newData;
      return {
        ...page,
        data: merge,
      };
    }, {});

  return (
    <QueryTable
      showHeader
      queryHook={useTokensBalanceTop}
      queryConfig={{
        config: { params: { ...filters, ...(sort && { sort }) } },
        options: { enabled: !!tokenID, select: fetchNextPage },
      }}
      transformResponse={(res) => res?.[tokenID]}
      row={WalletRow}
      additionalRowProps={{ token, tokenSupply }}
      header={header(t, toggleSort)}
    />
  );
};

export default WalletTable;
