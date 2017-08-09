import React from 'react';
import Button from 'react-toolbox/lib/button';
import { fromRawLsk } from '../../utils/lsk';
import styles from './pricedButton.css';

const PricedButton = (props) => {
  const hasFunds = props.balance >= props.fee;
  return (
    <div className='primary-button'>
      {
        props.fee &&
          <span className={`${styles.fee} ${hasFunds ? '' : styles.error}`}>
            {
              hasFunds ? `Fee: ${fromRawLsk(props.fee)} LSK` :
              `Not enough credit to pay ${fromRawLsk(props.fee)} LSK fee`
            }
          </span>
      }
      <Button label={props.label}
        primary={true} raised={true}
        className={`next-button ${props.customClassName}`}
        disabled={props.disabled || (props.fee && !hasFunds)}
        onClick={props.onClick.bind(this)}/>
    </div>
  );
};

export default PricedButton;
