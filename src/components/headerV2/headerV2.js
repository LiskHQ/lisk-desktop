import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import logo from '../../assets/images/lisk-logo-v2.svg';
import routes from '../../constants/routes';
import styles from './headerV2.css';

const HeaderV2 = ({ t }) => (
  <header className={`${styles.wrapper} mainHeader`}>
    <div className={`${styles.logo}`}>
      <img src={logo} />
    </div>
    <div>
      <Link className={styles.settingButton} to={routes.setting.path}>
        <SecondaryButtonV2>{t('Settings')}</SecondaryButtonV2>
      </Link>
    </div>
  </header>
);

export default translate()(HeaderV2);
