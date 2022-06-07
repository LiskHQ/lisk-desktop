import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import {
  selectActiveToken,
  selectActiveTokenAccount,
} from '@common/store';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import { PrimaryButton } from 'src/theme/buttons';

const TxComposer = ({
  children, transaction, onComposed, className, buttonTitle,
}) => {
  const { t } = useTranslation();
  const network = useSelector(state => state.network);
  const wallet = useSelector(selectActiveTokenAccount);
  const token = useSelector(selectActiveToken);
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority();
  const { fee, minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token,
    wallet,
    priorityOptions,
    transaction: {
      senderPublicKey: wallet.summary?.publicKey,
      nonce: wallet.sequence?.nonce,
      passphrase: wallet.passphrase, // @todo remove
      moduleAssetId: transaction.moduleAssetId,
      asset: transaction.asset,
    },
  });

  return (
    <Box className={className}>
      {children}
      <TransactionPriority
        token={token}
        fee={fee}
        minFee={Number(minFee.value)}
        customFee={customFee ? customFee.value : undefined}
        moduleAssetId={transaction.moduleAssetId}
        setCustomFee={setCustomFee}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
        loadError={prioritiesLoadError}
        isLoading={loadingPriorities}
      />
      <BoxFooter>
        <PrimaryButton
          onClick={onComposed}
          disabled={!transaction.isValid}
        >
          {
            buttonTitle ?? t('Continue')
          }
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
