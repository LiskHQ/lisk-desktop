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
      <MenuItem caption="Save this account locally"
        className='save-account'
        onClick={() => this.props.setActiveDialog({
          title: 'Save this account locally',
          childComponent: SaveAccount,
          childComponentProps: {
            done: this.forceUpdate.bind(this),
          },
        })}
      />
    );
  }
}

