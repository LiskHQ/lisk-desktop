/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import {
  elementTxToDesktopTx,
  convertTxJSONToBinary,
} from '@transaction/utils/transaction';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import { PrimaryButton } from 'src/theme/buttons';
import { useSchemas } from '@transaction/hooks/queries/useSchemas';
import { validateTransaction } from '@liskhq/lisk-transactions';
import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';

const reader = new FileReader();

const getTxObject = (value, moduleCommandSchemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: value.module,
    command: value.command,
  });
  const transactionObject = convertTxJSONToBinary(value, moduleCommand);
  const isValid = validateTransaction(transactionObject, moduleCommandSchemas[moduleCommand]);

  return {
    transactionObject,
    isValid,
  };
};

const Form = ({ t, nextStep, network }) => {
  const [transaction, setTransaction] = useState();
  const [binaryTx, setBinaryTx] = useState();
  const [error, setError] = useState();
  // @todo Once the transactions are refactored and working, we should
  // use the schema returned by this hook instead of reading from the Redux store.
  useSchemas();

  const onReview = () => {
    try {
      nextStep({ transaction: elementTxToDesktopTx(binaryTx) });
    } catch (e) {
      nextStep({ error: e });
    }
  };

  const validateAndSetTransaction = (value) => {
    setError(undefined);
    try {
      setTransaction(value);
      const { transactionObject, isValid } = getTxObject(value, network.networks.LSK.moduleCommandSchemas);
      setBinaryTx(transactionObject);
      setError(isValid ? 'Unknown transaction' : undefined);
    } catch (e) {
      setTransaction(undefined);
      setError('Invalid transaction');
    }
  };

  useEffect(() => {
    reader.onload = ({ target }) => {
      validateAndSetTransaction(target.result);
    };
  }, []);

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t(
              'Provide a signature for a transaction which belongs to a multisignature account.',
            )}
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
