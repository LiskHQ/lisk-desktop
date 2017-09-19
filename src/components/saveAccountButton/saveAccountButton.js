import { MenuItem } from 'react-toolbox/lib/menu';
import React from 'react';

import { getSavedAccount, removeSavedAccount } from '../../utils/saveAccount';
import SaveAccount from '../saveAccount';

export default class SaveAccountButton extends React.Component {
  removeSavedAccount() {
    removeSavedAccount();
    this.props.successToast({ label: 'Account forgotten locally.' });
    this.forceUpdate();
  }

  render() {
    return (getSavedAccount() ?
      <MenuItem caption="Forget this account locally"
        className='forget-account'
        onClick={this.removeSavedAccount.bind(this)}
      /> :
      <MenuItem caption="Remember this account"
        className='save-account'
        onClick={() => this.props.setActiveDialog({
          title: 'Remember this account',
          childComponent: SaveAccount,
          childComponentProps: {
            done: this.forceUpdate.bind(this),
          },
        })}
      />
    );
  }
}

