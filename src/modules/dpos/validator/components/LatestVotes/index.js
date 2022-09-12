import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { MODULE_COMMANDS_NAME_ID_MAP } from 'src/modules/transaction/configuration/moduleAssets';
import TransactionRow from '@transaction/components/TransactionRow';
import header from './tableHeader';
import { useDelegates } from '../../hooks/queries';
import mergeUniquely from '../../utils/mergeUniquely';

const LatestVotes = ({ filters }) => {
  const { t } = useTranslation();
  const { data: delegates } = useDelegates();
  const queryConfig = useRef({
    config: {
      params: {
        ...filters,
        moduleCommandID: MODULE_COMMANDS_NAME_ID_MAP.voteDelegate,
        sort: 'timestamp:desc',
      },
    },
  });

  const votedDelegates = useMemo(() => {
    if (!delegates) return {};

    const transformedResponse = mergeUniquely('username', delegates);
    const responseMap = transformedResponse.reduce((acc, delegate) => {
      acc[delegate.address] = delegate;
      return acc;
    }, {});
    return responseMap;
  }, [delegates]);

  return (
    <QueryTable
      showHeader
      queryHook={useTransactions}
      queryConfig={queryConfig.current}
      row={TransactionRow}
      header={header(t)}
      emptyState={{
        message: t('No latest votes'),
      }}
      additionalRowProps={{
        t,
        delegates: votedDelegates,
        activeToken: 'LSK',
        layout: 'vote',
      }}
    />
  );
};

export default LatestVotes;
