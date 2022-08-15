import React, { useState, useMemo, useCallback } from 'react';
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
  name,
  onRemove,
}) {
  const [isCollapsed, setCollapsed] = useState(!!value);
  const { t } = useTranslation();
  const byteCount = useMemo(() => sizeOfString(value), [value]);

  const onShrinkField = useCallback(() => {
    setCollapsed(!isCollapsed);
    onRemove?.();
  }, [isCollapsed]);

  return !isCollapsed
    ? (
      <TertiaryButton
        onClick={() => setCollapsed(!isCollapsed)}
        className={`${styles.addMessageButton} add-message-button`}
      >
        <Icon name="plusBlueIcon" />
        <span>Add message (Optional)</span>
      </TertiaryButton>
    )
    : (
      <div className={`${styles.container} reference`}>
        <div className={`${styles.fieldLabel}`}>
          <span>{label}</span>
          {' '}
          <TertiaryButton
            onClick={onShrinkField}
            className={styles.removeMessageButton}
          >
            <Icon name="removeBlueIcon" />
            <span>Remove</span>
          </TertiaryButton>
        </div>
        <span className={`${styles.referenceField}`}>
          <AutoResizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onChange}
            name={name}
            value={value}
            placeholder={placeholder}
            className={`${styles.textarea} ${error ? 'error' : ''}`}
            data-testid="reference-field"
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
          <span
            data-testid="feedback"
            className={`${styles.feedback} ${styles.show} ${maxMessageLength - byteCount < 10 ? styles.error : ''}`}
          >
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
      </div>
    );
}

export default MessageField;
