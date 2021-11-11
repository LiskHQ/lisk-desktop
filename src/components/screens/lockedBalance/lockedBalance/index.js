import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
  getActiveTokenAccount,
  getUnlockableUnlockObjects,
} from '@utils/account';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionPriority, { useTransactionFeeCalculation } from '@shared/transactionPriority';
import useTransactionPriority from '@shared/transactionPriority/useTransactionPriority';
import { selectCurrentBlockHeight } from '@store/selectors';
import Form from './form';
import BalanceTable from './balanceTable';

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;

const LockedBalance = (props) => {
  const account = useSelector(state => getActiveTokenAccount(state));
  const token = useSelector(state => state.settings.token.active);
  const transactions = useSelector(state => state.transactions);
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const unlockableBalance = calculateUnlockableBalance(
    account.dpos?.unlocking, currentBlockHeight,
  );
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      senderPublicKey: account.summary?.publicKey,
      nonce: account.sequence?.nonce,
      passphrase: account.passphrase,
      unlockObjects: getUnlockableUnlockObjects(account.dpos?.unlocking, currentBlockHeight),
    },
  });

  return (
    <Form
      signedTransaction={transactions.signedTransaction}
      txSignatureError={transactions.txSignatureError}
      data={{
        customFee,
        fee,
        unlockableBalance,
      }}
      {...props}
    >
      <BalanceTable
        lockedInVotes={lockedInVotes}
        unlockableBalance={unlockableBalance}
        currentBlockHeight={currentBlockHeight}
        account={account}
      />
      <TransactionPriority
        token={token}
        fee={fee}
        minFee={Number(minFee.value)}
        customFee={customFee ? customFee.value : undefined}
        moduleAssetId={moduleAssetId}
        setCustomFee={setCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities}
      />
    </Form>
  );
};

export default LockedBalance;
