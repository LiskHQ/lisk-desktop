import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Feedback from 'src/theme/feedback/feedback';
import styles from './uploadJSONInput.css';

const reader = new FileReader();
const UploadJSONInput = ({
  value,
  onChange,
  error,
  label,
  prefixLabel,
}) => {
  const onInputChange = ({ target }) => reader.readAsText(target.files[0]);
  const onPaste = (event) => onChange(JSON.parse(event.clipboardData.getData('text')));

  const { t } = useTranslation();

  useEffect(() => {
    reader.onload = ({ target }) => {
      onChange(JSON.parse(target.result));
    };
  }, [onChange]);

  return (
    <div>
      <p className={styles.fileInputLabel}>
        {prefixLabel}
        <label className={styles.fileInputBtn}>
          {label}
          <input
            role="button"
            className={`${styles.input} clickableFileInput`}
            type="file"
            accept="application/JSON"
            onChange={onInputChange}
          />
        </label>
      </p>
      <div
        className={`${styles.textAreaContainer} ${error && styles.error} ${
          value && !error ? styles.filled : ''
        }`}
      >
        <textarea
          onPaste={onPaste}
          onChange={onPaste}
          value={value && !error ? JSON.stringify(value) : ''}
          readOnly
          className={`${styles.txInput} tx-sign-input`}
        />
        <span>{t('Please drag and drop the JSON file from your device.')}</span>
        <Feedback
          message={error}
          size="m"
          status={error ? 'error' : 'ok'}
        />
      </div>
    </div>
  );
};

UploadJSONInput.defaultProps = {
  label: '',
  value: null,
  error: '',
  onChange: () => null,
};

export default UploadJSONInput;
