import { MenuItem } from 'react-toolbox/lib/menu';
import React from 'react';
import RelativeLink from '../relativeLink';
import styles from './saveAccountButton.css';

const SaveAccountButton = ({ account, savedAccounts, accountRemoved, t }) =>
  (savedAccounts.length > 0 ?
    <MenuItem caption={t('Forget this account')}
      className='forget-account'
      onClick={accountRemoved.bind(null, account.publicKey)}
    /> :
    <MenuItem>
      <RelativeLink className={`${styles.menuItem} save-account`} to='save-account'>
        {t('Save account')}
      </RelativeLink>
    </MenuItem>
  );

export default SaveAccountButton;
