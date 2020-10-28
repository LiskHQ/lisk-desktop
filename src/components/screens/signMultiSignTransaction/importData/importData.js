import React, { useState, useEffect } from 'react';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import Feedback from '../../../toolbox/feedback/feedback';
import ProgressBar from '../progressBar';
import styles from './styles.css';

// eslint-disable-next-line complexity
const isInputValid = ({
  nonce, fee, type, asset,
  lsTrackingId, senderPublicKey,
  signatures,
}) => {
  const {
    amount, recipientId, mandatoryKeys, data,
    optionalKeys, numberOfSignatures,
  } = asset;

  if (
    parseInt(nonce, 10) && parseInt(fee, 10) && type === 8 && parseInt(amount, 10)
    && Array.isArray(signatures) && Array.isArray(optionalKeys) && Array.isArray(mandatoryKeys)
    && typeof recipientId === 'string' && typeof data === 'string'
    && typeof lsTrackingId === 'string' && typeof senderPublicKey === 'string'
    && typeof numberOfSignatures === 'number'
  ) {
    return true;
  }
  return false;
};

const reader = new FileReader();

const ImportData = ({ t, nextStep }) => {
  const [transaction, setTransaction] = useState(undefined);
  const [error, setError] = useState(undefined);

  const onFileInputChange = ({ target }) => reader.readAsText(target.files[0]);
  const handleDrop = ({ dataTransfer }) => reader.readAsText(dataTransfer.files[0]);
  const onReview = () => {
    nextStep({ transaction });
  };

  useEffect(() => {
    reader.onload = ({ target }) => {
      try {
        const parsedInput = JSON.parse(target.result);
        if (isInputValid(parsedInput)) {
          setTransaction(parsedInput);
        } else {
          throw new Error('invalid json');
        }
      } catch (e) {
        setError(e);
      }
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
          <label className={`${styles.dropFileArea} ${error && styles.error}`}>
            <input
              className="dropfileInput"
              type="file"
              accept="application/JSON"
              onChange={onFileInputChange}
              onDrop={handleDrop}
            />
            <Feedback
              message={t('Invalid file')}
              size="m"
              status={error ? 'error' : 'ok'}
            />
          </label>
        </BoxContent>
        <BoxFooter className={styles.footer}>
          <PrimaryButton
            className="confirm"
            size="l"
            onClick={onReview}
            disabled={!transaction}
          >
            {t('Review and Sign')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default ImportData;
