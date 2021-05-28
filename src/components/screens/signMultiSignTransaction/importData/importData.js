/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { transactionToJSON, transformTransaction } from '../../../../utils/transaction';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import Feedback from '../../../toolbox/feedback/feedback';
import ProgressBar from '../progressBar';
import styles from './styles.css';

const reader = new FileReader();

const ImportData = ({ t, nextStep }) => {
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  const onReview = () => {
    try {
      nextStep({ transaction: transformTransaction(transaction) });
    } catch (e) {
      nextStep({ error: e });
    }
  };

  const validateAndSetTransaction = (input) => {
    try {
      const parsedInput = JSON.parse(input);
      setTransaction(parsedInput);
    } catch (e) {
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
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={1} />
          <p className={styles.fileInputlabel}>
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
              value={JSON.stringify(transaction)}
              readOnly
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

export default ImportData;
