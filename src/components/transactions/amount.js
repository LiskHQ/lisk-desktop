import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import { TooltipWrapper } from '../timestamp';
import ClickToSend from '../clickToSend';
import transactionTypes from '../../constants/transactionTypes';

const Amount = (props) => {
  const params = {};
  if (props.value.type === transactionTypes.send &&
    props.value.senderId === props.value.recipientId) {
    params.className = 'grayButton';
  } else if (props.value.senderId !== props.address) {
    params.className = 'inButton';
  } else if (props.value.type !== transactionTypes.send ||
      props.value.recipientId !== props.address) {
    params.className = 'outButton';
    params.tooltipText = props.value.type === transactionTypes.send ? props.t('Repeat the transaction') : undefined;
    params.clickToSendEnabled = props.value.type === transactionTypes.send;
  }
  return <TooltipWrapper tooltip={params.tooltipText}>
    <ClickToSend rawAmount={props.value.amount}
      className='amount'
      recipient={props.value.recipientId}
      disabled={!params.clickToSendEnabled}>
      <span id='transactionAmount' className={styles[params.className]}>
        <LiskAmount val={props.value.amount} />
      </span>
    </ClickToSend>
  </TooltipWrapper>;
};
// <FormattedNumber val={props.value.fee}></FormattedNumber>
export default translate()(Amount);
