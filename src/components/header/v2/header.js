import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/Lisk-Logo.svg';
import routes from '../../../constants/routes';
import styles from './header.css';

const Header = () => (
  <header className={`${styles.wrapper} mainHeader`}>
    <div className={`${styles.logo}`}>
      <img src={logo} />
    </div>
    <div className=''>
      <Link className={styles.settingButton} to={routes.setting.path}>
        Setting
      </Link>
    </div>
  </header>
);

export default Header;
