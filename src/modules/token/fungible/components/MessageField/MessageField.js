import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AutoResizeTextarea } from 'src/theme';
import { TertiaryButton } from 'src/theme/buttons';
import Feedback from 'src/theme/feedback/feedback';
import Icon from 'src/theme/Icon';
import CircularProgress from 'src/theme/ProgressCircular/circularProgress';
import Tooltip from 'src/theme/Tooltip';
import { sizeOfString } from 'src/utils/helpers';
import styles from './MessageField.css';

const messageErrorFeedback = {
  maxCharSize: 'Message size has exceeded the maximum allowed size',
};

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
  const [feedBackType, setFeedbackType] = useState(null);

  const onShrinkField = useCallback(() => {
    setCollapsed(!isCollapsed);
    onRemove?.();
  }, [isCollapsed]);

  useEffect(() => {
    setFeedbackType(maxMessageLength - byteCount < 0 ? 'maxCharSize' : null);
  }, [maxMessageLength, byteCount]);

  return !isCollapsed ? (
    <TertiaryButton
      onClick={() => setCollapsed(!isCollapsed)}
      className={`${styles.addMessageButton} add-message-button`}
    >
      <Icon name="plusBlueIcon" />
      <span>{t('Add message (Optional)')}</span>
    </TertiaryButton>
  ) : (
    <div className={`${styles.container} reference`}>
      <div className={`${styles.fieldLabel}`}>
        <span>{label}</span>{' '}
        <TertiaryButton onClick={onShrinkField} className={styles.removeMessageButton}>
          <Icon name="removeBlueIcon" />
          <span>{t('Remove')}</span>
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
        <CircularProgress max={maxMessageLength} value={byteCount} className={styles.byteCounter} />
        <Icon
          className={`${styles.status} ${!isLoading && value ? styles.show : ''}`}
          name={error ? 'alertIcon' : 'okIcon'}
        />
      </span>
      <div>
        <Feedback message={messageErrorFeedback[feedBackType]} status="error" />
        <span
          data-testid="feedback"
          className={`${styles.feedback} ${styles.show} ${
            maxMessageLength - byteCount < 10 ? styles.error : ''
          }`}
        >
          {feedback}
          {!!feedback && !error && (
            <Tooltip position="right" title={t('Bytes counter')}>
              <p className={styles.tooltipText}>
                {t(`Lisk counts your message in bytes, so keep in mind
                that the length of your message may vary in different languages.
                Different characters may consume a varying amount of bytes.`)}
              </p>
            </Tooltip>
          )}
        </span>
      </div>
    </div>
  );
}

export default MessageField;
