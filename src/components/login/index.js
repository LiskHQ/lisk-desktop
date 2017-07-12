import React from 'react';
// import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
// import styles from './login.css';

/**
 * The container component containing login and create account functionality
 */
class Login extends React.Component {
  constructor() {
    super();
    this.title = 'Login';
  }
  render() {
    return (
      <h1>{this.title}</h1>
    );
  }
}
export default Login;
