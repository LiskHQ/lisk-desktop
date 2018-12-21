import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import styles from './registerV2.css';

const RegisterV2 = ({ t }) => (
  <div className={`${styles.register} ${grid.row}`}>
    <div className={`${styles.wrapper} ${grid['col-sm-6']}`}>
      <div className={`${styles.titleHolder} ${grid['col-xs-10']}`}>
        <span className={`${styles.stepsLabel}`}>{t('Step 1 / 4')}</span>
        <h1>{t('Choose your Avatar')}</h1>
        <p>{
          t('Each Avatar is a visual representation of the address, making it unique.')
        }</p>
      </div>
      <div className={`${styles.buttonsHolder} ${grid.row}`}>
        <Link className={`${styles.button} ${grid['col-xs-6']}`} to={routes.splashscreen.path}>
          <SecondaryButtonV2>
            <FontIcon className={styles.icon}>arrow-left</FontIcon>
            {t('Go Back')}
          </SecondaryButtonV2>
        </Link>
        <Link className={`${styles.button} ${grid['col-xs-6']}`} to={routes.register.path}>
          <PrimaryButtonV2>
            {t('Confirm')}
            <FontIcon className={styles.icon}>arrow-right</FontIcon>
          </PrimaryButtonV2>
        </Link>
      </div>
    </div>
  </div>
);

export default translate()(RegisterV2);
