import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { NewSecondaryButton } from '../../toolbox/buttons/button';
import logo from '../../../assets/images/Lisk-Logo.svg';
import routes from '../../../constants/routes';
import styles from './header.css';

const Header = ({ t }) => (
  <header className={`${styles.wrapper} mainHeader`}>
    <div className={`${styles.logo}`}>
      <img src={logo} />
    </div>
    <div>
      <Link className={styles.settingButton} to={routes.setting.path}>
        <NewSecondaryButton>{t('Settings')}</NewSecondaryButton>
      </Link>
    </div>
  </header>
);

export default translate()(Header);
