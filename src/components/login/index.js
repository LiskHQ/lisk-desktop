import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LoginInner from './login';
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
          <LoginInner />
        </div>
      </div>
    </div>
  </section>
);

export default Login;
