import React from 'react';
import { maxMessageLength } from '@transaction/configuration/transactions';
import CircularProgress from 'src/theme/ProgressCircular/circularProgress';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { AutoResizeTextarea } from 'src/theme';
import styles from './form.css';

const MessageField = ({
  t,
  reference,
  setReference,
}) => (
  <label className={`${styles.fieldGroup} reference`}>
    <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
    <span className={styles.referenceField}>
      <AutoResizeTextarea
        maxLength={100}
        spellCheck={false}
        onChange={setReference}
        name="reference"
        value={reference.value}
        placeholder={t('Write message')}
        className={`${styles.textarea} ${reference.error ? 'error' : ''} message`}
      />
      <CircularProgress
        max={maxMessageLength}
        value={reference.byteCount}
        className={`${styles.byteCounter} ${reference.error ? styles.hide : ''}`}
      />
      <Icon
        className={`${styles.status} ${styles.referenceStatus} ${!reference.value ? styles.hide : styles.show}`}
        name={reference.error ? 'alertIcon' : 'okIcon'}
      />
    </span>
    <span className={`${styles.feedback} ${reference.error || maxMessageLength - reference.byteCount < 10 ? 'error' : ''} ${styles.show}`}>
      {reference.feedback}
      <Tooltip
        position="left"
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
    </span>
  </label>
);

export default MessageField;
