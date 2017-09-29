import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button';
import { fromRawLsk } from '../../utils/lsk';
import styles from './pricedButton.css';

export const PricedButtonComponent = ({
  balance, fee, label, customClassName, onClick, disabled, type,
}) => {
  const hasFunds = balance >= fee;
  return (
    <div className='primary-button'>
      {
        fee &&
          (<span className={`${styles.fee} ${hasFunds ? '' : `${styles.error} error-message`} `}>
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
        type={type || 'button'}
        className={`next-button ${customClassName}`}
        disabled={disabled || (fee && !hasFunds)}
        onClick={onClick} />
    </div>
  );
};

const mapStateToProps = state => ({
  balance: state.account.balance,
});

export default connect(mapStateToProps)(PricedButtonComponent);
