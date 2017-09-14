import React from 'react';
import styles from './clickToSend.css';
import Send from '../send';
import { fromRawLsk } from '../../utils/lsk';

const ClickToSend = props => (
  props.disabled ?
    props.children :
    <span className={`${styles.clickable} ${props.className}`}
      onClick={() => (props.setActiveDialog({
        title: 'Send',
        childComponent: Send,
        childComponentProps: {
          amount: props.rawAmount ? fromRawLsk(props.rawAmount) : props.amount,
          recipient: props.recipient,
        },
      }))}>
      {props.children}
    </span>
);

export default ClickToSend;
