import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import styles from './txComposer.css';

const Feedback = ({ feedback }) => {
  if (isEmpty(feedback)) return null;

  return (
    <div className={`${styles.feedback} feedback`}>
      <span>{feedback}</span>
    </div>
  );
};

export default Feedback;
