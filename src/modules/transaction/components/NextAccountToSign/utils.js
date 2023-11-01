import { useAccounts } from '@account/hooks';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import { getNextAccountToSign } from '@transaction/utils/multisignatureUtils';

export function useNextAccountToSign({ transactionJSON }) {
  const { getAccountByPublicKey } = useAccounts();

  const { txInitiatorAccount } = useTxInitiatorAccount({
    senderPublicKey: transactionJSON.senderPublicKey,
  });

  const nextAccountToSign = getNextAccountToSign({
    getAccountByPublicKey,
    transactionJSON,
    txInitiatorAccount,
  });

  return { nextAccountToSign };
}
