import { usePosConstants } from '@pos/validator/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { useTransactions } from '@transaction/hooks/queries';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { useNetworkStatus } from '@network/hooks/queries';

const getDateWhenCommissionCanBeIncreased = (
  timestampCommissionChange,
  commissionIncreasePeriod,
  blockTime
) => {
  const timestampWhenCommissionCanBeIncreased =
    (timestampCommissionChange + commissionIncreasePeriod * blockTime) * 1000;

  return new Date(timestampWhenCommissionCanBeIncreased);
};

export const useCommissionChangeDate = () => {
  const { data: posConstants } = usePosConstants();
  const [
    {
      metadata: { address },
    },
  ] = useCurrentAccount();
  const { data: transactions, isLoading } = useTransactions({
    config: {
      params: {
        address,
        moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
        limit: 1,
        sort: 'timestamp:desc',
      },
    },
  });

  const lastChangeCommissionTimestamp = transactions?.data[0]?.block?.timestamp;
  const { data: networkStatus } = useNetworkStatus();

  return {
    date:
      lastChangeCommissionTimestamp &&
      getDateWhenCommissionCanBeIncreased(
        lastChangeCommissionTimestamp,
        posConstants.data?.commissionIncreasePeriod,
        networkStatus?.data?.genesis?.blockTime
      ),
    isLoading,
  };
};
