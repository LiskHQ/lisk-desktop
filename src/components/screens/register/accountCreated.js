import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../../constants/routes';
import { PrimaryButton } from '../../toolbox/buttons';
import Icon from '../../toolbox/icon';

import registerStyles from './register.css';
import styles from './accountCreated.css';

const AccountCreated = ({ t }) => (
  <>
    <div className={`${registerStyles.titleHolder}`}>
      <h1>
        {t('Perfect! Almost done')}
      </h1>
    </div>
    <Icon name="initialiseRegistration" />
    <h3 className={styles.subHeading}>Now in order to secure your account you need to:</h3>
    <div className={`${grid.column} ${styles.content}`}>
      <span className={grid.row}>
        <Icon name="initialiseIcon" />
        <p className={styles.successCaption}>Deposit a small amount of LSK tokens</p>
      </span>
      <span className={grid.row}>
        <Icon name="liskIcon" />
        <p className={styles.successCaption}>Initialize your account</p>
      </span>
    </div>
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
