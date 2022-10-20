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
import { splitModuleAndCommand } from '../../utils';

// eslint-disable-next-line max-statements
const TxComposer = ({
  children,
  onComposed,
  onConfirm,
  className,
  buttonTitle,
  formProps = {},
  commandParams = {},
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
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const transactionJSON = {
    module,
    command,
    nonce: wallet.sequence?.nonce,
    fee: 0,
    senderPublicKey: wallet.summary?.publicKey,
    params: commandParams,
    signatures: [],
  };

  const status = useTransactionFeeCalculation({
    token,
    wallet,
    selectedPriority,
    priorityOptions,
    transactionJSON,
  });

  useEffect(() => {
    if (typeof onComposed === 'function') {
      onComposed(status, formProps, { ...transactionJSON, fee: toRawLsk(status.fee.value) });
    }
  }, [selectedPriority, transactionJSON.params]);

  const minRequiredBalance = getMinRequiredBalance(transactionJSON, status.fee);
  const { recipientChain, sendingChain } = formProps;

  const composedFees = {
    Transaction: getFeeStatus({ fee: status.fee, token, customFee }),
    Initialisation: getFeeStatus({ fee: status.fee, token, customFee }),
  };

  if (sendingChain && recipientChain && sendingChain.chainID !== recipientChain.chainID) {
    composedFees.CCM = getFeeStatus({ fee: status.fee, token, customFee });
  }

  formProps.composedFees = composedFees;
  transactionJSON.fee = toRawLsk(status.fee.value);

  if (recipientChain && sendingChain) {
    formProps.recipientChain = recipientChain;
    formProps.sendingChain = sendingChain;
  }

  return (
    <Box className={className}>
      {children}
      <TransactionPriority
        token={token}
        fee={status.fee}
        minFee={Number(status.minFee.value)}
        customFee={customFee ? customFee.value : undefined}
        moduleCommand={formProps.moduleCommand}
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
        feedback={formProps.feedback}
        minRequiredBalance={minRequiredBalance}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={() => onConfirm(
            formProps,
            transactionJSON,
            selectedPriority,
          )}
          disabled={!formProps.isValid || minRequiredBalance > wallet.token?.balance}
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
