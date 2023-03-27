import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import styles from './RestoreAccountForm.css';

const RestoreAccountForm = ({ onBack, nextStep }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState();
  const [error, setError] = useState();

  const onContinue = () => {
    // istanbul ignore next
    if (!value) {
      setError(t('Upload file is required'));
    } else {
      nextStep({ encryptedAccount: value });
    }
  };

  const handleJsonInputError = (inputError) => {
    setError(inputError.message);
  };

  const handleJsonInputChange = (json) => {
    if (json?.crypto?.ciphertext) {
      setValue(json);
      setError(undefined);
    } else {
      setError(t('You have uploaded an incorrect file'));
    }
  };

  return (
    <>
      <div className={styles.titleHolder}>
        <h1>{t('Add your account')}</h1>
        <p>{t('Restore your encrypted secret recovery phrase.')}</p>
      </div>
      <div className={styles.fullWidth}>
        <UploadJSONInput
          label={t('Restore from JSON file')}
          placeholderText={t('Please drag and drop the JSON file from your device.')}
          onChange={handleJsonInputChange}
          onError={handleJsonInputError}
          value={value}
          error={error}
        />
        <div className={styles.buttonHolder}>
          <PrimaryButton
            className="confirmButton"
            size="l"
            onClick={onContinue}
            disabled={!value || error}
          >
            {t('Continue')}
          </PrimaryButton>
          <TertiaryButton className="confirmButton" size="l" onClick={onBack}>
            {t('Go back')}
          </TertiaryButton>
        </div>
      </div>
    </>
  );
};
export default RestoreAccountForm;
