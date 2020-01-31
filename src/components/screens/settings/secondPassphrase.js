import { Link } from 'react-router-dom';
import React from 'react';
import { utils } from '@liskhq/lisk-transactions';
import Fees from '../../../constants/fees';
import Spinner from '../../toolbox/spinner';
import routes from '../../../constants/routes';
import styles from './settings.css';
import Icon from '../../toolbox/icon';

const fee = utils.convertBeddowsToLSK(`${Fees.setSecondPassphrase}`);

const SecondPassphraseSetting = ({
  account, hasSecondPassphrase, isHwWalletClass, t, hasPendingSecondPassphrase,
}) => (
  <div className={`${styles.fieldGroup} ${styles.checkboxField} second-passphrase`}>
    {hasSecondPassphrase
      ? (
        <Icon
          className={`${styles.checkmark} second-passphrase-registered`}
          name="checkmark"
        />
      )
      : null
    }
    <div className={isHwWalletClass}>
      <span className={styles.labelName}>{t('Second passphrase')}</span>
      <p>
        {t('Every time you make a transaction you’ll need to enter your second passphrase in order to confirm it.')}
      </p>
      {!hasSecondPassphrase
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
                    <Link
                      className={`register-second-passphrase ${styles.link}`}
                      to={`${routes.secondPassphrase.path}`}
                    >
                      {t('Activate ({{ fee }} LSK Fee)', { fee })}
                    </Link>
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
