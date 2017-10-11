import React from 'react';
import styles from './clickToSend.css';
import RelativeLink from '../relativeLink';
import { fromRawLsk } from '../../utils/lsk';

const ClickToSend = ({ rawAmount, amount, className,
  recipient, children, disabled }) => {
  const normalizedAmount = rawAmount ? fromRawLsk(rawAmount) : amount;
  const urlParams = new URLSearchParams();
  if (normalizedAmount) {
    urlParams.set('amount', normalizedAmount);
  }
  if (recipient) {
    urlParams.set('recipient', recipient);
  }

  return (
    disabled ?
      children :
      <RelativeLink className={`${styles.clickable} ${className}`}
        to={`send?${urlParams}`}>
        {children}
      </RelativeLink>
  );
};

export default ClickToSend;
