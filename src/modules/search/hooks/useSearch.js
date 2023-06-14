import { regex } from 'src/const/regex';
import { validateAddress } from 'src/utils/validators';
import { useTransactions } from '@transaction/hooks/queries';
import { useAuth } from 'src/modules/auth/hooks/queries';
import { useValidators } from '@pos/validator/hooks/queries';
import { useBlocks } from '@block/hooks/queries/useBlocks';

function getIsLoading(queryRes) {
  return queryRes.isLoading && queryRes.isFetching;
}

// eslint-disable-next-line complexity, max-statements
export const useSearch = (search = '', { disabled }) => {
  const isAddress = validateAddress(search) === 0;
  const isTxId = regex.transactionId.test(search);
  const isBlockHeight = regex.blockHeight.test(search);
  const isValidator = search.length >= 3 && !isAddress && !isTxId && !isBlockHeight;

  const addresses = useAuth({
    config: { params: { address: search } },
    options: { enabled: isAddress && !disabled },
  });

  const validators = useValidators({
    config: { params: { search } },
    options: { enabled: isValidator && !disabled },
  });

  const transactions = useTransactions({
    config: { params: { transactionID: search } },
    options: { enabled: isTxId && !disabled },
  });

  const blocks = useBlocks({
    config: { params: { height: search } },
    options: { enabled: isBlockHeight && !disabled },
  });

  const isLoading =
    getIsLoading(validators) ||
    getIsLoading(transactions) ||
    getIsLoading(addresses) ||
    getIsLoading(blocks);

  const isFetched =
    (isValidator && validators.isFetched) ||
    (isTxId && transactions.isFetched) ||
    (isAddress && addresses.isFetched) ||
    (isBlockHeight && blocks.isFetched);

  return {
    addresses: addresses.data?.meta ?? {},
    validators: validators.data?.data ?? [],
    transactions: transactions.data?.data ?? [],
    blocks: blocks.data?.data ?? [],
    isLoading,
    isFetched,
  };
};
