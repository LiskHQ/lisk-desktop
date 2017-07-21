import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LoginForm from './loginForm';
import styles from './login.css';


/**
 * The container component containing login
 * and create account functionality
 */
const Login = () => (
  <section>
    <div className={`box ${styles.wrapper}`}>
      <div className={`${grid.row} ${grid['center-xs']}`}>
        <div className={grid['col-xs-8']}>
          <LoginForm />
        </div>
      </div>
    </div>
  </section>
);

export default Login;
