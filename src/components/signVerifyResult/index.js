import React from 'react';
import Input from './../toolbox/input';
import styles from './signVerifyResult.css';

const SignVerifyResult = props => (
  <div className={styles.resultWrapper}>
    <h4>{props.title}</h4>
    <Input className={`${styles.result} result`} multiline readOnly value={props.result} />
  </div>
);

export default SignVerifyResult;
