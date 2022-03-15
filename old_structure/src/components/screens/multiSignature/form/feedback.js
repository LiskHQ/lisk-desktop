import React from 'react';
import BoxFooter from '@toolbox/box/footer';

import styles from './styles.css';

const Feedback = ({ messages }) => (
  <BoxFooter
    direction="horizontal"
    className={styles.footer}
  >
    <div className={`${styles.feedback} feedback`}>
      <span>{messages[0]}</span>
    </div>
  </BoxFooter>
);

export default Feedback;
