import React from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import AccountVisual from '../accountVisual';
import check from '../../assets/images/icons-v2/check.svg';
import registerStyles from './registerV2.css';
import styles from './accountCreated.css';

const AccountCreated = ({ t, account }) => (
  <React.Fragment>
    <span className={`${registerStyles.stepsLabel}`}>{t('Step 4 / 4')}</span>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        <img src={check} />
        {t('Your Account is created!')}
      </h1>
      <p>{t('You can now manage and secure your LSK tokens.')}</p>
    </div>

    <div className={`${styles.accountHolder}`}>
      <span className={`${styles.avatar}`}>
        <AccountVisual
          address={account.address}
          size={87}
          />
      </span>
      <p className={`${styles.address}`}>{account.address}</p>
    </div>

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <Link className={`${registerStyles.button} ${grid['col-xs-5']}`} to={routes.login.path}>
        <PrimaryButtonV2>
          {t('Sign In')}
        </PrimaryButtonV2>
      </Link>
    </div>
  </React.Fragment>
);

export default translate()(AccountCreated);
