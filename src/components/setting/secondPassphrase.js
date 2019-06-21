import { Link } from 'react-router-dom';
import React from 'react';
import Fees from '../../constants/fees';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import routes from '../../constants/routes';
import svgIcons from '../../utils/svgIcons';
import styles from './setting.css';

const SecondPassphraseSetting = ({
  account, hasSecondPassphrase, isHwWalletClass, t, hasPendingSecondPassphrase,
}) => (
  <div className={`${styles.fieldGroup} ${styles.checkboxField} second-passphrase`}>
    {hasSecondPassphrase
      ? <img
          className={`${styles.checkmark} second-passphrase-registered`}
          src={svgIcons.checkmark}
        />
      : null
    }
    <div className={isHwWalletClass}>
      <span className={styles.labelName}>{t('Second Passphrase')}</span>
      <p>
        {t('Every time you make a transaction you’ll need to enter your second passphrase in order to confirm it.')}
      </p>
      {!hasSecondPassphrase ?
        <React.Fragment>
          {account.balance < Fees.setSecondPassphrase ?
          <p className={styles.highlight}>
            {t('You don’t have enough balance to enable it. 5 LSK is required.')}
          </p> :
          <React.Fragment>
            <p className={styles.highlight}>{t('Once activated can’t be turned off.')}</p>
            {hasPendingSecondPassphrase ? (
              <SpinnerV2
                className={styles.loading}
                label={t('Second Passphrase is being activated. Almost there!')}
              />
            ) : (
              <Link
                className={`register-second-passphrase ${styles.link}`}
                to={`${routes.secondPassphrase.path}`}>
                {t('Activate (5 LSK Fee)')}
              </Link>
            )}
          </React.Fragment>
          }
        </React.Fragment>
      : null}
    </div>
  </div>
);

export default SecondPassphraseSetting;
