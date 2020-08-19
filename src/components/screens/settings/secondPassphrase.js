import React from 'react';
import { transactions } from '@liskhq/lisk-client';
import Fees from '../../../constants/fees';
import Spinner from '../../toolbox/spinner';
import DialogLink from '../../toolbox/dialog/link';
import styles from './settings.css';
import Icon from '../../toolbox/icon';

const fee = transactions.utils.convertBeddowsToLSK(`${Fees.setSecondPassphrase}`);

const SecondPassphraseSetting = ({
  account, t, hasPendingSecondPassphrase, isHardwareWalletAccount,
}) => (
  <div className={`${styles.fieldGroup} ${styles.checkboxField} second-passphrase`}>
    {account.secondPublicKey
      ? (
        <Icon
          className={`${styles.checkmark} second-passphrase-registered`}
          name="checkmark"
        />
      )
      : null
    }
    <div className={isHardwareWalletAccount ? `${styles.disabled} disabled` : ''}>
      <span className={styles.labelName}>{t('Second passphrase')}</span>
      <p>
        {t('Every time you make a transaction you’ll need to enter your second passphrase in order to confirm it.')}
      </p>
      {!account.secondPublicKey
        ? (
          <React.Fragment>
            {account.balance < Fees.setSecondPassphrase
              ? (
                <p className={styles.highlight}>
                  {t('You don’t have enough balance to enable it. {{fee}} LSK is required.', { fee })}
                </p>
              )
              : (
                <React.Fragment>
                  <p className={styles.highlight}>{t('Once activated can’t be turned off.')}</p>
                  {hasPendingSecondPassphrase ? (
                    <Spinner
                      className={styles.loading}
                      label={t('Second passphrase is being activated. Almost there!')}
                    />
                  ) : (
                    <DialogLink
                      className={`register-second-passphrase ${styles.link}`}
                      component="secondPassphrase"
                    >
                      {t('Activate ({{ fee }} LSK Fee)', { fee })}
                    </DialogLink>
                  )}
                </React.Fragment>
              )
          }
          </React.Fragment>
        )
        : null}
    </div>
  </div>
);

export default SecondPassphraseSetting;
