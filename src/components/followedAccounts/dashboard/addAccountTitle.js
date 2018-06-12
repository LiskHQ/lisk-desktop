import React from 'react';
import { translate } from 'react-i18next';
import styles from './followedAccounts.css';

class AddAccountTitle extends React.Component {
  render() {
    return <div>
      <header><h2>How would you call it?</h2></header>
      <div></div>
    </div>;
  }
}

export default translate()(AddAccountTitle);
