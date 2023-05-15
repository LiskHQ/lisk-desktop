import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryTable } from 'src/theme/QueryTable';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import TransactionRow from '@transaction/components/TransactionRow';
import usePosToken from '../../hooks/usePosToken';
import { useValidators } from '../../hooks/queries';
import header from './tableHeader';

const LatestStakes = ({ filters }) => {
  const { t } = useTranslation();
  const { data: validators } = useValidators();
  const { token } = usePosToken();
  const queryConfig = useMemo(
    () => ({
      config: {
        params: {
          ...filters,
          moduleCommand: MODULE_COMMANDS_NAME_MAP.stake,
          sort: 'timestamp:desc',
        },
      },
    }),
    [filters]
  );

  const validatorsMap = useMemo(() => {
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
      queryConfig={queryConfig}
      row={TransactionRow}
      header={header(t)}
      emptyState={{
        message: t('No validator stakes found.'),
      }}
      additionalRowProps={{
        t,
        validators: validatorsMap,
        activeToken: token ?? { symbol: 'LSK' },
        layout: 'stake',
      }}
    />
  );
};

export default LatestStakes;
