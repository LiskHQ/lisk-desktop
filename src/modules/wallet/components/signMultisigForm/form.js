/* eslint-disable complexity */
import React, { useState } from 'react';
import { fromTransactionJSON, toTransactionJSON } from '@transaction/utils/encoding';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { useCommandSchema } from '@network/hooks';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import { PrimaryButton } from 'src/theme/buttons';
import { useDeprecatedAccount } from 'src/modules/account/hooks';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { transactions } from '@liskhq/lisk-client';
import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';

const getParamsSchema = (transaction, schemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });

  return schemas[moduleCommand];
};

const getTransactionObject = (transaction, moduleCommandSchemas) => {
  const paramsSchema = getParamsSchema(transaction, moduleCommandSchemas);
  const transactionObject = fromTransactionJSON(transaction, paramsSchema);
  const isValid = transactions.validateTransaction(transactionObject, paramsSchema);

  return {
    transactionObject,
    isValid,
  };
};

// eslint-disable-next-line max-statements
const Form = ({ t, nextStep }) => {
  const [transaction, setTransaction] = useState();
  const [transactionObject, setTransactionObject] = useState();
  const [error, setError] = useState();
  const { moduleCommandSchemas } = useCommandSchema();
  // @todo Once the transactions are refactored and working, we should
  // use the schema returned by this hook instead of reading from the Redux store.
  useSchemas();
  useDeprecatedAccount();

  const onReview = () => {
    try {
      const paramsSchema = getParamsSchema(transaction, moduleCommandSchemas);
      const moduleCommand = joinModuleAndCommand(transaction);
      const formProps = { moduleCommand };
      nextStep({ formProps, transactionJSON: toTransactionJSON(transactionObject, paramsSchema) });
    } catch (e) {
      nextStep({ error: e });
    }
  };

  const validateAndSetTransaction = (value) => {
    setError(undefined);

    try {
      setTransaction(value);
      const result = getTransactionObject(value, moduleCommandSchemas);
      setTransactionObject(result.transactionObject);
      // TODO: Need to handle the validator error and show to end user
      setError(result.isValid ? 'Unknown transaction' : undefined);
    } catch (e) {
      setTransaction(undefined);
      setError('Invalid transaction');
    }
  };

  const handleJsonInputError = (inputError) => {
    setError(inputError.message);
  };

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t('Provide a signature for a transaction which belongs to a multisignature account.')}
          </p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <UploadJSONInput
            prefixLabel={`${t('Paste transaction value')}  `}
            label={t('Read from JSON file')}
            onChange={validateAndSetTransaction}
            value={transaction}
            error={error}
            onError={handleJsonInputError}
          />
        </BoxContent>
        <BoxFooter className={styles.footer}>
          <PrimaryButton
            className="confirm"
            size="l"
            onClick={onReview}
            disabled={!transaction || error}
          >
            {t('Review and sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Form;
