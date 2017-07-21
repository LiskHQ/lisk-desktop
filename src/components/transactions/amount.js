import React from 'react';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import { TooltipWrapper } from '../timestamp';

const Amount = (props) => {
  let template = null;
  let tooltipText = null;
  const amount = <LiskAmount val={props.value.amount} />;
  if (props.value.type === 0 &&
    props.value.senderId === props.value.recipientId) {
    template = <span className={styles.grayButton}>{amount}</span>;
  } else if (props.value.senderId !== props.address) {
    template = <span className={styles.inButton}>{amount}</span>;
  } else if (props.value.type !== 0 || props.value.recipientId !== props.address) {
    template = <span className={styles.outButton}>{amount}</span>;
    tooltipText = 'Repeat the transaction';
  }
  return <TooltipWrapper tooltip={tooltipText}>{template}</TooltipWrapper>;
};
// <FormattedNumber val={props.value.fee}></FormattedNumber>
export default Amount;
