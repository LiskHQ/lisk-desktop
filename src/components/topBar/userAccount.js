import React from 'react';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import LiskAmount from '../liskAmount';
import styles from './userAccount.css';

const UserAccount = props => (
  <div className={`${styles.wrapper} user-account`}>
    <div className={styles.information}>
      <CopyToClipboard
        value={props.account.address}
        className={`${styles.copyAddress} account-information-address`}
        copyClassName={styles.copy}
      />
      <div className={`${styles.balance} balance`}>
        <LiskAmount val={props.account.balance}/>
        <span>{props.t(' LSK')}</span>
      </div>
    </div>
    <AccountVisual
      address={'123L'}
      size={69} sizeS={40}
    />
  </div>
);

export default UserAccount;
