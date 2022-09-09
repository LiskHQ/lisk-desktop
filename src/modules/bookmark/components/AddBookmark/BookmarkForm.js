import React from 'react';
import WalletVisual from '@wallet/components/walletVisual';
import { Input } from 'src/theme';
import styles from './AddBookmark.css';

const getFields = (t) => [
  {
    name: 'address',
    label: t('Address'),
    placeholder: t('Insert public address'),
    className: 'input-address',
  },
  {
    name: 'label',
    label: t('Label'),
    feedback: t('Max. 20 characters'),
    placeholder: t('Insert label'),
    className: 'input-label',
  },
];

const BookmarkForm = ({ status, handlers, t }) => (
  <>
    {getFields(t).map((field, index) => (
      <label key={field.name}>
        <span className={styles.label}>{field.label}</span>
        <span className={styles.fieldGroup}>
          <Input
            error={status[index].feedback !== ''}
            className={`${styles.input} ${field.className}`}
            value={status[index].value}
            onChange={handlers[index]}
            name={field.name}
            placeholder={field.placeholder}
            readOnly={status[index].readonly}
            size="l"
            autoComplete="off"
            feedback={status[index].feedback}
            status={status[index].feedback === '' ? 'ok' : 'error'}
          />
          {field.name === 'address' ? (
            <WalletVisual className={styles.avatar} address={status[index].value} size={25} />
          ) : null}
        </span>
      </label>
    ))}
  </>
);

export default BookmarkForm;
