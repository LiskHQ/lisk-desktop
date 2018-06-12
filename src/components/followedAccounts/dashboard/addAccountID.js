import React from 'react';
import { translate } from 'react-i18next';
import styles from './followedAccounts.css';

class AddAccountID extends React.Component {
  render() {
    return <div>
      <header><h2>Choose an ID</h2></header>
      <div></div>
    </div>;
  }
}

export default translate()(AddAccountID);
