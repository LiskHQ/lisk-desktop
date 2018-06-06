import React from 'react';
import styles from './form.css';

const Form = ({
  wordOptions, words, missing, answers, formStatus,
  trials, selectedFieldset, onWordSelected, selectFieldset,
}) => {
  let missingWordIndex = -1;

  return (<form className={`passphrase-holder ${styles.form} ${styles[formStatus]}`}>
    {
      wordOptions ?
        words.map((word, index) => {
          if (!missing.includes(index)) {
            return (<span key={word} className={styles.word}>{word}</span>);
          }
          missingWordIndex++;
          const validity = answers[missingWordIndex] && answers[missingWordIndex].validity ? 'valid' : 'invalid';
          return (
            <fieldset key={`${word}-${missingWordIndex}-${trials}`}>
              <span onClick={e => selectFieldset(e)} field={missingWordIndex}
                className={`${styles.placeholder} ${selectedFieldset === missingWordIndex ?
                  styles.selected : ''} ${answers[missingWordIndex] ? styles[validity] : ''}`}>
                { answers[missingWordIndex] ? answers[missingWordIndex].value : '' }
              </span>
              {
                wordOptions[missingWordIndex].map(wd =>
                  <div key={`${wd}-${missingWordIndex}-${trials}`}>
                    <input
                      name={`answer${missingWordIndex}`}
                      className={styles.option}
                      answer={missingWordIndex}
                      type='radio'
                      value={wd}
                      id={`${wd}-${missingWordIndex}-${trials}`}
                      onChange={onWordSelected} />
                    <label className={styles.option} htmlFor={`${wd}-${missingWordIndex}-${trials}`}>{wd}</label>
                  </div>)
              }
            </fieldset>
          );
        }) : null
    }
  </form>);
};

export default Form;
