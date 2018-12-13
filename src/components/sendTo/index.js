import React from 'react';
import Send from './send';
import FollowAccount from './followAccount';
import MultiStep from '../multiStep';

class SendTo extends React.Component {
  render() {
    return (<MultiStep>
      <Send {...this.props}/>
      <FollowAccount />
    </MultiStep>);
  }
}

export default SendTo;
