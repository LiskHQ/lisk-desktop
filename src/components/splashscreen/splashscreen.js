import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../constants/routes';
import { NewPrimaryButton, NewSecondaryButton } from '../toolbox/buttons/button';
import styles from './splashscreen.css';

const Splashscreen = () => (
  <div className={`${styles.splashscreen} ${grid.row}`}>
    <div className={`${styles.wrapper} ${grid['col-sm-6']}`}>
      <div className={`${grid['col-xs-10']} ${styles.titleHolder}`}>
        <h1>Welcome to the Lisk Hub!</h1>
        <p>Create an account or sign in to manage your LSK,
        become a delegate or vote for another delegates.</p>
      </div>
      <Link className={styles.button} to={routes.login.path}>
        <NewSecondaryButton>Sign in</NewSecondaryButton>
      </Link>
      <Link className={styles.button} to={routes.register.path}>
        <NewPrimaryButton>Create an Account</NewPrimaryButton>
      </Link>
      <span className={styles.separator}>
        <span>or</span>
      </span>
      <Link className={styles.link} to={routes.dashboard.path}>Explore as Guest</Link>
    </div>
  </div>
);

export default Splashscreen;
