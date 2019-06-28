import React from 'react';
import { SecondaryButtonV2, PrimaryButtonV2 } from '../toolbox/buttons/button';
import styles from './options.css';

const Options = ({ firstButton, secondButton, text }) =>
  (
    <div className={styles.optionsBody}>
      <p className={styles.text}>{text}</p>
      <section className={`${styles.buttonsRow}`}>
        <SecondaryButtonV2 label={firstButton.text} onClick={firstButton.onClickHandler} className="ok-button" />
        <PrimaryButtonV2 label={secondButton.text} onClick={secondButton.onClickHandler} className="ok-button" />
      </section>
    </div>
  );

export default Options;
