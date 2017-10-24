import { MenuItem } from 'react-toolbox/lib/menu';
import React from 'react';
import RelativeLink from '../relativeLink';

const SaveAccountButton = ({ account, savedAccounts, accountRemoved, t, theme }) =>
  (savedAccounts.length > 0 ?
    <MenuItem caption={t('Forget this account')}
      className='forget-account'
      onClick={accountRemoved.bind(null, account.publicKey)}
    /> :
    <MenuItem theme={theme}>
      <RelativeLink className={`${theme.menuLink} save-account`} to='save-account'>
        {t('Save account')}
      </RelativeLink>
    </MenuItem>
  );

export default SaveAccountButton;
