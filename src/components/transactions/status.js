import React from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './transactions.css';

const Status = (props) => {
  let template = null;
  if (props.value.type === 0 &&
    props.value.senderId === props.value.recipientId) {
    template = <IconButton icon='replay' />;
  } else if (props.value.senderId !== props.address) {
    template = <IconButton icon='call_received' className={styles.in} />;
  } else if (props.value.type !== 0 || props.value.recipientId !== props.address) {
    template = <IconButton icon='call_made' className={styles.out} />;
  }
  return template;
};

export default Status;
