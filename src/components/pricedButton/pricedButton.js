import React from 'react';
import { PrimaryButton } from '../toolbox/buttons/button';
import { fromRawLsk } from '../../utils/lsk';
import styles from './pricedButton.css';

const PricedButton = ({
  balance, fee, label, customClassName, onClick, disabled, type, t,
}) => {
  const hasFunds = balance >= fee;
  return (
    <div className='primary-button'>
      {
        fee &&
          (<span className={`${styles.fee} ${hasFunds ? '' : `${styles.error} error-message`} `}>
            {
              hasFunds ? t('Fee: {{amount}} LSK', { amount: fromRawLsk(fee) }) :
                t('Insufficient funds for {{amount}} LSK fee', { amount: fromRawLsk(fee) })
            }
          </span>)
      }
      <PrimaryButton
        label={label}
        raised={true}
        type={type || 'button'}
        className={`next-button ${customClassName}`}
        disabled={disabled || (fee && !hasFunds)}
        onClick={onClick} />
    </div>
  );
};

export default PricedButton;
