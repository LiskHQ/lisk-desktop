import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { selectActiveToken, selectActiveTokenAccount } from 'src/redux/selectors';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import { convertToken, fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton } from 'src/theme/buttons';
import Feedback, { getMinRequiredBalance } from './Feedback';
import { getFeeStatus } from '../../utils/helpers';
import { splitModuleAndCommand } from '../../utils';
import { useTransactionFee } from '../../hooks/useTransactionFee/useTransactionFee';

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
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const { t } = useTranslation();

  // @todo Once the transactions are refactored and working, we should
  // use the schema returned by this hook instead of reading from the Redux store.
  useSchemas();
  useDeprecatedAccount();
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const { data: auth } = useAuth({ config: { params: { address } } });
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

  const transactionJSON = {
    module,
    command,
    nonce: auth?.data?.nonce,
    fee: formProps.extraCommandFee || 0,
    senderPublicKey: pubkey,
    params: commandParams,
    signatures: [],
  };

  const { minimumFee, components, transactionFee } = useTransactionFee({
    selectedPriority,
    transactionJSON,
    isFormValid: formProps.isFormValid,
    senderAddress: address,
    extraCommandFee: formProps.extraCommandFee,
  });

  useEffect(() => {
    if (typeof onComposed === 'function') {
      onComposed({}, formProps, {
        ...transactionJSON,
        fee: toRawLsk(transactionFee),
      });
    }
  }, [selectedPriority, transactionJSON.params]);

  const minRequiredBalance = getMinRequiredBalance(transactionJSON, transactionFee);
  const { recipientChain, sendingChain } = formProps;

  const composedFees = [
    {
      title: 'Transaction',
      value: getFeeStatus({
        fee: Number(convertToken(transactionFee, formProps.fields.token)),
        token,
        customFee,
      }),
      components,
    },
    {
      title: 'Message',
      value: getFeeStatus({
        fee: Number(fromRawLsk(transactionJSON.params.messageFee || 0)),
        token,
        customFee,
      }),
      isHidden: !transactionJSON.params.messageFee,
      components: [],
    },
  ];

  formProps.composedFees = composedFees;
  transactionJSON.fee = transactionFee;

  if (recipientChain && sendingChain) {
    formProps.recipientChain = recipientChain;
    formProps.sendingChain = sendingChain;
  }

  return (
    <Box className={className}>
      {children}
      <TransactionPriority
        token={token}
        fee={transactionFee}
        minFee={+minimumFee}
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
        balance={formProps.fields?.token?.availableBalance}
        feedback={formProps.feedback}
        minRequiredBalance={minRequiredBalance}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={() => onConfirm(formProps, transactionJSON, selectedPriority, composedFees)}
          disabled={!formProps.isFormValid || minRequiredBalance > wallet.token?.balance}
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
