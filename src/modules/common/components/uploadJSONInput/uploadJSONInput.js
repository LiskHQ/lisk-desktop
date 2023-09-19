import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import Feedback from 'src/theme/feedback/feedback';
import styles from './uploadJSONInput.css';

const UploadJSONInput = ({
  value,
  onChange,
  onError,
  error,
  label,
  prefixLabel,
  placeholderText,
}) => {
  const { t } = useTranslation();

  const onParse = (text) => {
    try {
      onChange(JSON.parse(text));
    } catch (e) {
      onError(e);
    }
  };

  const onInputChange = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      onParse(event.target.result);
    };
    reader.readAsText(file);
  }, []);

  const onPaste = (event) => {
    onParse(event.clipboardData.getData('text'));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onInputChange,
    accept: {
      'application/JSON': ['.json'],
    },
    noClick: true,
  });

  return (
    <div {...getRootProps()} data-testid="upload-json-wrapper">
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
            {...getInputProps()}
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
          data-testid="tx-sign-input"
        />
        <span className={styles.fileInputLabel}>
          {isDragActive
            ? t('Please drop the JSON here.')
            : t(placeholderText || 'Please paste the JSON or drag and drop the file here.')}
        </span>
        <Feedback message={error} size="m" status={error ? 'error' : 'ok'} />
      </div>
    </div>
  );
};

UploadJSONInput.defaultProps = {
  label: '',
  value: null,
  error: '',
  onChange: () => null,
  onError: () => null,
};

export default UploadJSONInput;
