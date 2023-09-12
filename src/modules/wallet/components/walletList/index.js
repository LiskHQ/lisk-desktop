import React from 'react';
import { useTranslation } from 'react-i18next';

import { QueryTable } from '@theme/QueryTable';
import { useSort } from 'src/modules/common/hooks';
import { useTokensBalanceTop } from '@token/fungible/hooks/queries';
import WalletRow from '../row';
import header from './tableHeader';

const WalletTable = ({ tokenData, tokenSummary, filters }) => {
  const { t } = useTranslation();
  const { sort, toggleSort } = useSort({ defaultSort: 'balance:desc' });
  const token = tokenData?.data?.[0];
  const tokenSupply = tokenSummary?.data?.totalSupply?.filter(
    (tokenInfo) => tokenInfo.tokenID === token?.tokenID
  )[0];

  /* istanbul ignore next */
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
        options: { enabled: !!token?.tokenID, select: fetchNextPage },
      }}
      transformResponse={(res) => res?.[filters.tokenID] || []}
      row={WalletRow}
      additionalRowProps={{ token, tokenSupply }}
      header={header(t, toggleSort)}
      currentSort={sort}
      emptyState={{
        message: t('There are no accounts to display.'),
      }}
    />
  );
};

export default WalletTable;
