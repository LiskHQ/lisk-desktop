import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import Box from 'src/theme/box';
import BoxFooter from 'src/theme/box/footer';
import TransactionPriority from '@transaction/components/TransactionPriority';
import { getTotalSpendingAmount } from '@transaction/utils/transaction';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { useDeprecatedAccount } from '@account/hooks/useDeprecatedAccount';
import { PrimaryButton } from 'src/theme/buttons';
import Feedback from './Feedback';
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

  useSchemas();
  useDeprecatedAccount();
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const { data: auth } = useAuth({ config: { params: { address } } });
  const { symbol: tokenSymbol = '' } = formProps.fields.token || {};
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
    fee: 0,
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
        fee: convertToBaseDenom(transactionFee, formProps.fields.token),
      });
    }
  }, [selectedPriority, transactionJSON.params]);

  const minRequiredBalance =
    BigInt(transactionFee) + BigInt(getTotalSpendingAmount(transactionJSON));
  const { recipientChain, sendingChain } = formProps;
  const composedFees = [
    {
      title: 'Transaction',
      value: getFeeStatus({
        fee: Number(convertFromBaseDenom(transactionFee, formProps.fields.token)),
        tokenSymbol,
        customFee,
      }),
      components,
    },
    {
      title: 'Message',
      value: getFeeStatus({
        fee: Number(
          convertFromBaseDenom(transactionJSON.params.messageFee || 0, formProps.fields.token)
        ),
        tokenSymbol,
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
        token={formProps.fields?.token}
        fee={transactionFee}
        minFee={minimumFee}
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
        feedback={formProps.feedback}
        minRequiredBalance={minRequiredBalance.toString()}
        token={formProps.fields?.token || {}}
      />
      <BoxFooter>
        <PrimaryButton
          className="confirm-btn"
          onClick={() => onConfirm(formProps, transactionJSON, selectedPriority, composedFees)}
          disabled={
            !formProps.isFormValid ||
            minRequiredBalance > BigInt(formProps.fields?.token?.availableBalance || 0)
          }
        >
          {buttonTitle ?? t('Continue')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default TxComposer;
