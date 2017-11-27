import React from 'react';
import Send from './../send';

import Receive from './../receiveDialog';

function Transfer(props) {
  if (props.activeTab === 'send') {
    return <Send />;
  }
  return <Receive />;
}

export default Transfer;
