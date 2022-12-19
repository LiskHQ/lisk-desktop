import { regex } from 'src/const/regex';
import { validateAddress } from 'src/utils/validators';
import { useTransactions } from '@transaction/hooks/queries';
import { useDelegates } from '@dpos/validator/hooks/queries';
import { useBlocks } from '@block/hooks/queries/useBlocks';

// eslint-disable-next-line complexity,max-statements
export const useSearch = (search = '') => {
  const isAddress = validateAddress(search) === 0;
  const isTxId = regex.transactionId.test(search);
  const isBlockHeight = regex.blockHeight.test(search);
  const isDelegate = search.length >= 3 && !isAddress && !isTxId && !isBlockHeight;

  const addresses = useDelegates({
    config: { params: { address: search } },
    options: { enabled: isAddress },
  });

  const delegates = useDelegates({
    config: { params: { search } },
    options: { enabled: isDelegate },
  });

  const transactions = useTransactions({
    config: { params: { transactionID: search } },
    options: { enabled: isTxId },
  });

  const blocks = useBlocks({
    config: { params: { height: search } },
    options: { enabled: isBlockHeight },
  });

  const isLoading =
    delegates.isLoading || transactions.isLoading || addresses.isLoading || blocks.isLoading;

  return {
    addresses: addresses.data?.data ?? [],
    delegates: delegates.data?.data ?? [],
    transactions: transactions.data?.data ?? [],
    blocks: blocks.data?.data ?? [],
    isLoading,
  };
};
