import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import TransactionRow from '@transaction/components/TransactionRow';
import header from './tableHeader';
import { useValidators } from '../../hooks/queries';

const LatestVotes = ({ filters }) => {
  const { t } = useTranslation();
  const { data: delegates } = useValidators();
  const queryConfig = useMemo(
    () => ({
      config: {
        params: {
          ...filters,
          moduleCommandID: MODULE_COMMANDS_NAME_MAP.voteDelegate,
          sort: 'timestamp:desc',
        },
      },
    }),
    [filters]
  );

  const votedDelegates = useMemo(() => {
    if (!delegates || !delegates.data) return {};

    const responseMap = delegates.data.reduce((acc, delegate) => {
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
