import React from 'react';
import Button from 'react-toolbox/lib/button';
import { fromRawLsk } from '../../utils/lsk';
import styles from './pricedButton.css';

const PricedButton = ({
  balance, fee, label, customClassName, onClick, disabled,
}) => {
  const hasFunds = balance >= fee;
  return (
    <div className='primary-button'>
      {
        fee &&
          (<span className={`${styles.fee} ${hasFunds ? '' : styles.error}`}>
            {
              hasFunds ? `Fee: ${fromRawLsk(fee)} LSK` :
              `Insufficient funds for ${fromRawLsk(fee)} LSK fee`
            }
          </span>)
      }
      <Button
        label={label}
        primary={true}
        raised={true}
        className={`next-button ${customClassName}`}
        disabled={disabled || (fee && !hasFunds)}
        onClick={onClick.bind(this)} />
    </div>
  );
};

export default PricedButton;
