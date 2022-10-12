import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { selectActiveToken, selectActiveTokenAccount } from 'src/redux/selectors';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton } from 'src/theme/buttons';
import Feedback, { getMinRequiredBalance } from './Feedback';
import { getFeeStatus } from '../../utils/helpers';

// eslint-disable-next-line max-statements
const TxComposer = ({
  children,
  transaction = {},
  onComposed,
  onConfirm,
  className,
  buttonTitle,
}) => {
  const { t } = useTranslation();
  // @todo Once the transactions are refactored and working, we should
  // use the schema returned by this hook instead of reading from the Redux store.
  useSchemas();
  useDeprecatedAccount();
  const wallet = useSelector(selectActiveTokenAccount);
  const token = useSelector(selectActiveToken);
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority,
    selectTransactionPriority,
    priorityOptions,
    prioritiesLoadError,
    loadingPriorities,
  ] = useTransactionPriority();
  const rawTx = {
    sender: { publicKey: wallet.summary?.publicKey },
    nonce: wallet.sequence?.nonce,
    moduleCommand: transaction.moduleCommand,
    params: transaction.params,
  };
  const status = useTransactionFeeCalculation({
    token,
    wallet,
    selectedPriority,
    priorityOptions,
    transaction: rawTx,
  });

  useEffect(() => {
    if (typeof onComposed === 'function') {
      onComposed(status, { ...rawTx, fee: toRawLsk(status.fee.value) });
    }
  }, [selectedPriority, transaction.asset]);

  const minRequiredBalance = getMinRequiredBalance(transaction, status.fee);
  const { recipientChain, sendingChain } = transaction;

  const composedFees = {
    Transaction: getFeeStatus({ fee: status.fee, token, customFee }),
    Initialisation: getFeeStatus({ fee: status.fee, token, customFee }),
  };

  if (sendingChain && recipientChain && sendingChain.chainID !== recipientChain.chainID) {
    composedFees.CCM = getFeeStatus({ fee: status.fee, token, customFee });
  }

  rawTx.composedFees = composedFees;
  rawTx.fee = toRawLsk(status.fee.value);
  if (recipientChain && sendingChain) {
    rawTx.recipientChain = recipientChain;
    rawTx.sendingChain = sendingChain;
  }

  return (
    <Box className={className}>
      {children}
      <TransactionPriority
        token={token}
        fee={status.fee}
        minFee={Number(status.minFee.value)}
        customFee={customFee ? customFee.value : undefined}
        moduleCommand={transaction.moduleCommand}
        setCustomFee={setCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities}
        composedFees={composedFees}
      />
      <Feedback
        balance={wallet.token?.balance}
        feedback={transaction.feedback}
        minRequiredBalance={minRequiredBalance}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={() => onConfirm(rawTx, selectedPriority)}
          disabled={!transaction.isValid || minRequiredBalance > wallet.token?.balance}
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
