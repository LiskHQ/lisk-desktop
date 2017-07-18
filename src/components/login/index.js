import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LoginForm from './loginForm';
import styles from './login.css';


/**
 * The container component containing login
 * and create account functionality
 */
const LoginComponent = () => (
  <section>
    <div className={`box ${styles.paddingTop}`}>
      <div className={`${grid.row}`}>
        <div className={grid['col-xs-2']}></div>
        <div className={grid['col-xs-8']}>
          <LoginForm />
        </div>
        <div className={grid['col-xs-2']}></div>
      </div>
    </div>
  </section>
);

export default LoginComponent;
