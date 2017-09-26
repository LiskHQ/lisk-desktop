import React from 'react';
import styles from './clickToSend.css';
import RelativeLink from '../relativeLink';
import { fromRawLsk } from '../../utils/lsk';

const ClickToSend = ({ rawAmount, amount, className,
  recipient, children, disabled }) => {
  const normalizedAmount = rawAmount ? fromRawLsk(rawAmount) : amount;

  return (
    disabled ?
      children :
      <RelativeLink className={`${styles.clickable} ${className}`}
        to={`send?amount=${normalizedAmount}&&recipient=${recipient}`}>
        {children}
      </RelativeLink>
  );
};

export default ClickToSend;
