import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import registerStyles from './registerV2.css';
import styles from './accountCreated.css';

const AccountCreated = ({ t, account }) => (
  <React.Fragment>
    <span className={`${registerStyles.stepsLabel}`}>{t('Step 4 / 4')}</span>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Your Account is Ready!')}
      </h1>
      <p>{t('You can now securely store and manage your LSK tokens.')}</p>
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
        to={routes.loginV2.path}>
        <PrimaryButtonV2>
          {t('Sign In')}
        </PrimaryButtonV2>
      </Link>
    </div>
  </React.Fragment>
);

export default translate()(AccountCreated);
