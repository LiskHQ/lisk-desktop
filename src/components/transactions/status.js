import React from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './transactions.css';

const Status = (props) => {
  let iconProps = {};
  if (props.value.type === 0 &&
    props.value.senderId === props.value.recipientId) {
    iconProps = {
      icon: 'replay',
    };
  } else if (props.value.senderId !== props.address) {
    iconProps = {
      icon: 'call_received',
      className: styles.in,
    };
  } else if (props.value.type !== 0 || props.value.recipientId !== props.address) {
    iconProps = {
      icon: 'call_made',
      className: styles.out,
    };
  }
  return <IconButton {...iconProps} disabled={true}/>;
};

export default Status;
