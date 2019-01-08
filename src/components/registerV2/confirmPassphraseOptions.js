import React from 'react';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import styles from './confirmPassphrase.css';

const ConfirmPassphraseOptions = ({
  optionIndex, options, answers, handleSelect, enabled = null,
}) => (
  <span className={`${styles.optionsHolder} ${answers[optionIndex] ? styles.answered : ''}`}>
    <span
      className={`${styles.answer}`}
      onClick={() => !!answers[optionIndex] && handleSelect(null, optionIndex)}>
      <span className={`${styles.choice}`}>{answers[optionIndex]}</span>
    </span>
    <span className={`${styles.options}`}>
      {options.map((option, optionKey) =>
        <span
          className={`${styles.option} ${answers[optionIndex] === option ? styles.selected : ''}`}
          key={optionKey}>
          <PrimaryButtonV2
            onClick={() => handleSelect(option, optionIndex)}
            disabled={!enabled}>
            { option }
          </PrimaryButtonV2>
        </span>)}
    </span>
  </span>
);

export default ConfirmPassphraseOptions;
