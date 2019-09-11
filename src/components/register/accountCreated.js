import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import { PrimaryButton } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import registerStyles from './register.css';
import styles from './accountCreated.css';

const AccountCreated = ({ t, account }) => (
  <React.Fragment>
    <span className={`${registerStyles.stepsLabel}`}>
      {t('Step {{current}} / {{total}}', { current: 4, total: 4 })}
    </span>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Your account was created!')}
      </h1>
      <p className={styles.text}>{t('Here’s your address! You can now securely store and manage your LSK tokens.')}</p>
    </div>

    <div className={`${styles.accountHolder}`}>
      <span className={`${styles.avatar}`}>
        <AccountVisual
          address={account.address}
          size={67}
        />
      </span>
      <p className={`${styles.address}`}>{account.address}</p>
      <p className={`${styles.titleHolder}`}>{t('Address')}</p>
    </div>

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <Link
        className={`${registerStyles.button} login-button`}
        to={routes.login.path}
      >
        <PrimaryButton className={registerStyles.continueBtn}>
          {t('Sign in')}
        </PrimaryButton>
      </Link>
    </div>
  </React.Fragment>
);

export default translate()(AccountCreated);
