import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { PrimaryButton, TertiaryButton } from 'src/theme/buttons';
import Feedback from 'src/theme/feedback/feedback';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './restoreAccount.css';

const RestoreAccount = ({ t }) => {
  const [error, setError] = useState();
  const [accountJSON, setaccountJSON] = useState();
  const reader = new FileReader();

  const onFileInputChange = ({ target }) => reader.readAsText(target.files[0]);
  const onPaste = () => {
    // const paste = evt.clipboardData.getData('text');
    setaccountJSON(reader.result);
  };

  useEffect(() => {
    setError('');
  }, []);

  return (
    <>
      <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
        <h1>
          {t('Add account')}
        </h1>
        <p className={styles.text}>{t('Restore your encrypted secret recovery phrase.')}</p>
      </div>
      <div className={styles.fullWidth}>
        <p className={styles.fileInputLabel}>
          <label className={styles.fileInputBtn}>
            {t('Restore from JSON file')}
            <input
              className={`${styles.input} clickableFileInput`}
              type="file"
              accept="application/JSON"
              onChange={onFileInputChange}
            />
          </label>
        </p>
        <div
          className={`${styles.textAreaContainer} ${error && styles.error}`}
        >
          <textarea
            onPaste={onPaste}
            onChange={onPaste}
            value={accountJSON ? JSON.stringify(accountJSON) : ''}
            readOnly
            className={`${styles.txInput} tx-sign-input`}
          />
          <Feedback
            message={error}
            size="m"
            status={error ? 'error' : 'ok'}
          />
        </div>
        <div className={styles.buttonHolder}>
          <PrimaryButton
            className="confirmButton"
            size="l"
            // onClick={onReview}
            // disabled={!transaction || error}
          >
            {t('Continue')}
          </PrimaryButton>
          <TertiaryButton
            className="confirmButton"
            size="l"
            // onClick={onReview}
            // disabled={!transaction || error}
          >
            {t('Go back')}
          </TertiaryButton>
        </div>
      </div>
    </>
  );
};
export default withTranslation()(RestoreAccount);
