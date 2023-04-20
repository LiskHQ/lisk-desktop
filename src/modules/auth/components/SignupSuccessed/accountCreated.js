import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import { PrimaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';

import registerStyles from '../Signup/register.css';
import styles from './accountCreated.css';

const AccountCreated = ({ t }) => (
  <div className={styles.container}>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>{t('Great! Your account is now created')}</h1>
    </div>
    <Illustration className={styles.illustration} name="registrationSuccess" />
    <p className={styles.subHeader}>
      {t(
        'You can now add your account to Lisk Wallet by clicking on "Continue". Once your account is added to wallet you will be able to send and request tokens and do much more.'
      )}
    </p>
    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <Link
        className={`${registerStyles.button} login-button`}
        to={routes.addAccountBySecretRecovery.path}
      >
        <PrimaryButton className={registerStyles.continueBtn}>
          {t('Continue to wallet')}
        </PrimaryButton>
      </Link>
    </div>
  </div>
);

export default withTranslation()(AccountCreated);
