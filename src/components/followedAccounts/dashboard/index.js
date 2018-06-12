import React from 'react';
import { translate } from 'react-i18next';
import ViewAccounts from './viewAccounts';
import AddAccountID from './addAccountID';
import addAccountTitle from './addAccountTitle';
import MultiStep from './../../multiStep';

class FollowedAccounts extends React.Component {
  render() {
    return <div>
      <MultiStep>
        <ViewAccounts />
        <AddAccountID />
        <addAccountTitle />
      </MultiStep>
    </div>;
  }
}

export default translate()(FollowedAccounts);
