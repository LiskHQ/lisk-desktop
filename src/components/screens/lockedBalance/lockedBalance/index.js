import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  calculateBalanceLockedInVotes,
  calculateUnlockableBalance,
  getActiveTokenAccount,
  getUnlockableUnlockingObjects,
} from '@utils/account';
import { MODULE_ASSETS } from '@constants/moduleAssets';
import TransactionPriority, { useTransactionFeeCalculation } from '@shared/transactionPriority';
import useTransactionPriority from '../../../shared/transactionPriority/useTransactionPriority';
import Form from './form';
import BalanceTable from './balanceTable';

const moduleAssetType = MODULE_ASSETS.unlockToken;

const LockedBalance = (props) => {
  const account = useSelector(state => getActiveTokenAccount(state));
  const token = useSelector(state => state.settings.token.active);
  const currentBlockHeight = useSelector(state => state.blocks.latestBlocks[0].height || 0);
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const unlockableBalance = calculateUnlockableBalance(account.unlocking, currentBlockHeight);
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
      moduleAssetType,
      senderPublicKey: account.publicKey,
      nonce: account.nonce,
      passphrase: account.passphrase,
      unlockingObjects: getUnlockableUnlockingObjects(account.unlocking, currentBlockHeight),
    },
  });

  return (
    <Form
      data={{
        account,
        customFee,
        fee,
        currentBlockHeight,
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
        minFee={minFee.value}
        customFee={customFee ? customFee.value : undefined}
        txType={txType}
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
