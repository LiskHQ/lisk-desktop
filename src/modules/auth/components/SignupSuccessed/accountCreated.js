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
  <>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>{t("Perfect! You're all set")}</h1>
      <p className={styles.text}>
        {t('You can now start sending and receiving LSK tokens')}
      </p>
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
  </>
);

export default withTranslation()(AccountCreated);
