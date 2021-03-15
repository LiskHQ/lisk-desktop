import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { routes } from '@constants';
import { PrimaryButton } from '../../toolbox/buttons';
import registerStyles from './register.css';
import styles from './accountCreated.css';
import Illustration from '../../toolbox/illustration';

const AccountCreated = ({ t }) => (
  <React.Fragment>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Perfect! You\'re all set')}
      </h1>
      <p className={styles.text}>{t('You can now start sending and receiving LSK')}</p>
    </div>

    <Illustration className={styles.illustration} name="registrationSuccess" />

    <div className={`${registerStyles.buttonsHolder} ${grid.row}`}>
      <Link
        className={`${registerStyles.button} login-button`}
        to={routes.login.path}
      >
        <PrimaryButton className={registerStyles.continueBtn}>
          {t('Continue to sign in')}
        </PrimaryButton>
      </Link>
    </div>
  </React.Fragment>
);

export default withTranslation()(AccountCreated);
