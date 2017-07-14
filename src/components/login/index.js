import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LoginForm from './login-form';
import { accountUpdated } from '../../actions/account';

/**
 * Using react-redux connect to pass state and dispatch to LoginForm
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
});

const LoginFormConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);

/**
 * The container component containing login
 * and create account functionality
 */
const LoginComponent = () => (
  <section>
    <div className='box'>
      <div className={`${grid.row}`}>
        <div className={grid['col-xs-2']}></div>
        <div className={grid['col-xs-8']}>
          <LoginFormConnected />
        </div>
        <div className={grid['col-xs-2']}></div>
      </div>
    </div>
  </section>
);

export default LoginComponent;
