/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { transformTransaction, createTransactionObject, flattenTransaction } from '@utils/transaction';
import { joinModuleAndAssetIds } from '@utils/moduleAssets';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';
import Feedback from '@toolbox/feedback/feedback';
import { validateTransaction } from '@liskhq/lisk-transactions';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const reader = new FileReader();

const Form = ({ t, nextStep, network }) => {
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  const onReview = () => {
    try {
      nextStep({ transaction: transformTransaction(transaction) });
    } catch (e) {
      nextStep({ error: e });
    }
  };

  // eslint-disable-next-line max-statements
  const validateAndSetTransaction = (input) => {
    try {
      const parsedInput = JSON.parse(input);
      setTransaction(parsedInput);
      const moduleAssetId = joinModuleAndAssetIds({
        moduleID: parsedInput.moduleID,
        assetID: parsedInput.assetID,
      });

      const schema = network.networks.LSK.moduleAssetSchemas[moduleAssetId];
      const transformedTransaction = transformTransaction(parsedInput);
      const flattenedTransaction = flattenTransaction(transformedTransaction);
      const transactionObject = createTransactionObject(flattenedTransaction, moduleAssetId);
      const err = validateTransaction(schema, transactionObject);

      if (err) {
        throw Error('Unknown transaction');
      }
      setError(undefined);
    } catch (e) {
      setTransaction(undefined);
      setError('Invalid transaction');
    }
  };

  const onFileInputChange = ({ target }) => reader.readAsText(target.files[0]);
  const onPaste = (evt) => {
    const paste = evt.clipboardData.getData('text');
    validateAndSetTransaction(paste);
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
          <p>{t('Provide a signature for a transaction which belongs to a multisignature account.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <p className={styles.fileInputLabel}>
            {t('Paste transaction value')}
            <label className={styles.fileInputBtn}>
              {t('Read from JSON file')}
              <input
                className={`${styles.input} clickableFileInput`}
                type="file"
                accept="application/JSON"
                onChange={onFileInputChange}
              />
            </label>
          </p>
          <div className={`${styles.textAreaContainer} ${error && styles.error} ${transaction && styles.filled}`}>
            <textarea
              onPaste={onPaste}
              onChange={onPaste}
              value={transaction ? JSON.stringify(transaction) : ''}
              readOnly
              className={`${styles.txInput} tx-sign-input`}
            />
            <Feedback
              message={error}
              size="m"
              status={error ? 'error' : 'ok'}
            />
          </div>
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
