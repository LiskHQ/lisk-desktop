import React from 'react';
import { translate } from 'react-i18next';
import ViewAccounts from './viewAccounts';
import AddAccountID from './addAccountID';
import AddAccountTitle from './addAccountTitle';
import MultiStep from './../../multiStep';
import styles from './followedAccounts.css';

const FollowedAccounts = () => (<MultiStep className={styles.followedAccountsWrapper}>
        <ViewAccounts />
        <AddAccountID />
        <AddAccountTitle />
      </MultiStep>);

export default translate()(FollowedAccounts);
