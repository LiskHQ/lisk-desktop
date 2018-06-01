import React from 'react';
import UserVotes from './userVotes';

class AccountInfo extends React.Component {
  render() {
    return (
      <UserVotes {...this.props} />
    );
  }
}

export default AccountInfo;

