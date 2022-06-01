import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import UploadJSONInput from 'src/modules/common/components/uploadJSONInput';
import styles from './restoreAccountForm.css';

const RestoreAccountForm = ({ onBack, nextStep }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState();
  const [error, setError] = useState();

  const onContinue = () => {
    if (!value) {
      setError(t('Upload file is required'));
    } else {
      nextStep({ accountSchema: value });
    }
  };

  return (
    <>
      <div className={styles.titleHolder}>
        <h1>
          {t('Add account')}
        </h1>
        <p>{t('Restore your encrypted secret recovery phrase.')}</p>
      </div>
      <div className={styles.fullWidth}>
        <UploadJSONInput
          label={t('Restore from JSON file')}
          onChange={setValue}
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
          <TertiaryButton
            className="confirmButton"
            size="l"
            onClick={onBack}
          >
            {t('Go back')}
          </TertiaryButton>
        </div>
      </div>
    </>
  );
};
export default RestoreAccountForm;
