import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import links from '../../constants/externalLinks';
import Tooltip from '../toolbox/tooltip/tooltip';
import HeaderV2 from '../headerV2/headerV2';
import lock from '../../assets/images/icons-v2/lock.svg';
import styles from './loginV2.css';

const LoginV2 = ({ t }) => (
  <React.Fragment>
  <HeaderV2 showSettings={true} showNetwork={true} />
    <div className={`${styles.login} ${grid.row}`}>
      <div
        className={`${styles.wrapper} ${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>

        <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
          <h1>
            <img src={lock} />
            {t('Sign in with a Passphrase')}
          </h1>
          <p>
            {t('New to Lisk?')}
            <Link to={routes.registration.path}>
              {t('Create an Account')}
            </Link>
          </p>
        </div>


        <div className={styles.inputsHolder}>
          <h2>
            {t('Type or insert your passphrase')}
            <Tooltip
              title={'What is passphrase?'}
              footer={
                <a href={links.howToStorePassphrase}
                  rel="noopener noreferrer"
                  target="_blank">
                    {t('Read More')}
                </a>}>
              <p>
                {t(`Passphrase is both your login and password combined.
                You saved your password when registering your account.`)}
              </p>
              <p>{t('You can use tab or space to go to the next field.')}</p>
              <p>{t('For longer passphrases, simply paste it in the first input field.')}</p>
            </Tooltip>
          </h2>

        </div>


        <div className={`${styles.buttonsHolder} ${grid.row}`}>
          <Link className={`${styles.button} ${grid['col-xs-4']}`} to={routes.splashscreen.path}>
            <SecondaryButtonV2>
              <FontIcon className={`${styles.icon}`}>arrow-left</FontIcon>
              {t('Go Back')}
            </SecondaryButtonV2>
          </Link>
          <span className={`${styles.button} ${grid['col-xs-4']}`}>
            <PrimaryButtonV2>
              {t('Confirm')}
              <FontIcon className={`${styles.icon}`}>arrow-right</FontIcon>
            </PrimaryButtonV2>
          </span>
        </div>

      </div>
    </div>
  </React.Fragment>
);

export default translate()(LoginV2);
