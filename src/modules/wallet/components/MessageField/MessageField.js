import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoResizeTextarea } from 'src/theme';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import CircularProgress from 'src/theme/ProgressCircular/circularProgress';
import Tooltip from 'src/theme/Tooltip';
import { sizeOfString } from 'src/utils/helpers';
import styles from './MessageField.css';

function MessageField({
  onChange,
  value,
  maxMessageLength,
  isLoading,
  error,
  feedback,
  label,
  placeholder,
}) {
  const [isCollapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const byteCount = useMemo(() => sizeOfString(value), [value]);

  return !isCollapsed
    ? (
      <TertiaryButton
        onClick={() => setCollapsed(!isCollapsed)}
        className={styles.addMessageButton}
      >
        <Icon name="plusBlueIcon" />
        Add message (Optional)
      </TertiaryButton>
    )
    : (
      <label className={`${styles.container} reference`}>
        <span className={`${styles.fieldLabel}`}>
          {label}
          {' '}
          <TertiaryButton
            onClick={() => setCollapsed(!isCollapsed)}
            className={styles.removeMessageButton}
          >
            <Icon name="removeBlueIcon" />
            Remove
          </TertiaryButton>
        </span>
        <span className={`${styles.referenceField}`}>
          <AutoResizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onChange}
            name="reference"
            value={value}
            placeholder={placeholder}
            className={`${styles.textarea} ${error ? 'error' : ''}`}
          />
          <CircularProgress
            max={maxMessageLength}
            value={byteCount}
            className={styles.byteCounter}
          />
          <Icon
            className={`${styles.status} ${!isLoading && value ? styles.show : ''}`}
            name={error ? 'alertIcon' : 'okIcon'}
          />
          <span className={`${styles.feedback} ${styles.show} ${maxMessageLength - byteCount < 10 ? styles.error : ''}`}>
            {feedback}
            {!!feedback && (
            <Tooltip
              position="right"
              title={t('Bytes counter')}
            >
              <p className={styles.tooltipText}>
                {
                t(`Lisk counts your message in bytes, so keep in mind
                that the length of your message may vary in different languages.
                Different characters may consume a varying amount of bytes.`)
              }
              </p>
            </Tooltip>
            )}
          </span>
        </span>
      </label>
    );
}

export default MessageField;
