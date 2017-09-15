import { Button } from 'react-toolbox/lib/button';
import QRCode from 'qrcode.react';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import ActionBar from '../actionBar';
import offlineStyle from '../offlineWrapper/offlineWrapper.css';
import style from './receiveButton.css';

export class ReceiveDialog extends React.Component {
  copyAddress() {
    const copied = this.props.copyToClipboard(this.props.account.address, {
      message: 'Press #{key} to copy',
    });
    if (copied) {
      this.props.successToast({ label: 'Address copied to clipboard' });
      this.props.closeDialog();
    }
  }

  render() {
    const props = this.props;
    return (
      <div>
        <div className={ `${grid.row} ${grid['center-xs']}` }>
          <span>
            <h3>Address</h3>
            <h1 className={style.address}>{props.account.address}</h1>
            <br />
            <QRCode value={props.account.address} size={300}/>
            <br /><br />
          </span>
        </div>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: 'Copy address to clipboard',
            className: 'copy-address-button',
            onClick: this.copyAddress.bind(this),
          }} />
      </div>
    );
  }
}

const ReceiveButton = props => (
  <Button className={`${props.className} receive-button ${offlineStyle.disableWhenOffline}`}
    raised
    primary={props.primary}
    onClick={() => props.setActiveDialog({
      title: 'Receive LSK',
      childComponent: ReceiveDialog,
      childComponentProps: props,
    })}>{props.label}</Button>
);

export default ReceiveButton;
