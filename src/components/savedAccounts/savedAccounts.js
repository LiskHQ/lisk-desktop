import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import React from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import ActionBar from '../actionBar';
import InfoParagraph from '../infoParagraph';
import networks from '../../constants/networks';
import getNetwork from '../../utils/getNetwork';
import { extractAddress } from '../../utils/api/account';

import styles from './savedAccounts.css';

const SavedAccounts = ({
  networkOptions,
  publicKey,
  closeDialog,
  accountSaved,
  accountRemoved,
  accountSwitched,
  savedAccounts,
  t,
}) => {
  const save = () => {
    accountSaved({
      network: networkOptions.code,
      address: networkOptions.address,
      publicKey,
    });
  };

  const isActive = account => (
    account.publicKey === publicKey &&
    account.network === networkOptions.code);

  return (
    <div className='save-account'>
      { savedAccounts.length === 0 ?
        <InfoParagraph>
          {t('This will save public key of your account on this device, so next time it will launch without the need to log in. However, you will be prompted to enter the passphrase once you want to do any transaction.')}
        </InfoParagraph> :
        <div className={styles.tableWrapper} >
          <Table selectable={false} className='saved-accounts-table'>
            <TableHead>
              <TableCell className={styles.iconCell} >{t('Switch')}</TableCell>
              <TableCell>{t('Address')}</TableCell>
              <TableCell>{t('Network')}</TableCell>
              <TableCell className={styles.iconCell} >{t('Forget')}</TableCell>
            </TableHead>
            {savedAccounts.map(account => (
              <TableRow key={account.publicKey + account.network}
                className={(isActive(account) ? styles.isActive : null)}>
                <TableCell className={styles.iconCell} >
                  <IconButton icon='exit_to_app'
                    disabled={isActive(account)}
                    className='switch-button'
                    onClick={accountSwitched.bind(this, account)} />
                </TableCell>
                <TableCell>
                  {extractAddress(account.publicKey)}
                </TableCell>
                <TableCell>
                  {account.network === networks.customNode.code ?
                    account.address :
                    t(getNetwork(account.network).name)}
                </TableCell>
                <TableCell className={styles.iconCell} >
                  <IconButton icon='clear' className='forget-button'
                    onClick={accountRemoved.bind(this, account)} />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      }
      <ActionBar
        secondaryButton={{
          onClick: closeDialog,
          label: t('Close'),
          className: 'close-button',
        }}
        primaryButton={{
          label: t('Add active account'),
          className: 'add-active-account-button',
          disabled: savedAccounts.filter(isActive).length !== 0,
          onClick: save.bind(this),
        }} />
    </div>
  );
};

export default SavedAccounts;
