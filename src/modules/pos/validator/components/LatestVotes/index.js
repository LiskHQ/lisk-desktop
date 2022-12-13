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
  const { data: validators } = useValidators();
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

  const votedValidators = useMemo(() => {
    if (!validators || !validators.data) return {};

    const responseMap = validators.data.reduce((acc, validator) => {
      acc[validator.address] = validator;
      return acc;
    }, {});
    return responseMap;
  }, [validators]);

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
        delegates: votedValidators,
        activeToken: 'LSK',
        layout: 'vote',
      }}
    />
  );
};

export default LatestVotes;
