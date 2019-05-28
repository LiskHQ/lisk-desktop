// istanbul ignore file
import React from 'react';
import { translate } from 'react-i18next';
import ViewAccounts from './viewAccounts';
import AddAccountID from './addAccountID';
import AddAccountTitle from './addAccountTitleHOC';
import MultiStep from '../multiStep/index';
import styles from './bookmarks.css';

const Bookmarks = ({ history }) => (<MultiStep className={styles.bookmarksWrapper}>
  <ViewAccounts history={history}/>
  <AddAccountID />
  <AddAccountTitle />
</MultiStep>);

export default translate()(Bookmarks);
