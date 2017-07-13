import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import { dialogDisplayed } from '../../actions/dialog';
import store from '../../store';
import { accountUpdated } from '../../actions/account';

// import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
// import styles from './login.css';


const Any = props => (<div>
    <h1> {props.address}</h1>
    <hr />
    <Button onClick={() => store.dispatch(dialogDisplayed({ title: 'Secondary', childComponentProps: { address: 'dialog', accountUpdated }, childComponent: Any }))} label='test3'/>
  </div>);


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
      <div>
        <h1>{this.title}</h1>
        <Button onClick={() => store.dispatch(dialogDisplayed({ title: 'Vit and Ali', childComponentProps: { address: 'Potsdamer Platz', accountUpdated }, childComponent: Any }))} label='test'/>
        <Button onClick={() => store.dispatch(dialogDisplayed({ title: '2222', childComponentProps: { address: 'dap dap 2', accountUpdated }, childComponent: Any }))} label='test2'/>
      </div>
    );
  }
}
export default Login;
