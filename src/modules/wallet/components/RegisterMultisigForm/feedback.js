import React from 'react';
import BoxFooter from 'src/theme/box/footer';

import styles from './styles.css';

const Feedback = ({ messages }) => (
  <BoxFooter direction="horizontal" className={styles.footer}>
    <div className={`${styles.feedback} feedback`}>
      <span>{messages[0]}</span>
    </div>
  </BoxFooter>
);

export default Feedback;
