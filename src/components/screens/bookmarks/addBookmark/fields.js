import React from 'react';
import AccountVisual from '../../../toolbox/accountVisual';
import { Input } from '../../../toolbox/inputs';
import styles from './addBookmark.css';

const Fields = ({ fields, status, onInputChange }) => (
  <>
    {fields.map(field => (
      <label key={field.name}>
        <span className={styles.label}>
          {field.label}
        </span>
        <span className={styles.fieldGroup}>
          <Input
            error={status[field.name].error}
            className={styles.input}
            value={status[field.name].value}
            onChange={onInputChange[field.name]}
            name={field.name}
            placeholder={field.placeholder}
            readOnly={status[field.name].readonly}
            size="l"
            autoComplete="off"
            feedback={status[field.name].feedback}
            status={status[field.name].error ? 'error' : 'ok'}
          />
          {field.name === 'address' ? (
            <AccountVisual
              className={styles.avatar}
              placeholder={status[field.name].isInvalid || !status[field.name].value}
              address={status[field.name].value}
              size={25}
            />
          ) : null
          }
        </span>
      </label>
    ))}
  </>
);

export default Fields;
