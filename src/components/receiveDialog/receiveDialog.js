import QRCode from 'qrcode.react';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import ActionBar from '../actionBar';
import style from './receiveDialog.css';

class ReceiveDialog extends React.Component {
  copyAddress() {
    const copied = this.props.copyToClipboard(this.props.address, {
      message: this.props.t('Press #{key} to copy'),
    });
    if (copied) {
      this.props.successToast({ label: this.props.t('Address copied to clipboard') });
      this.props.closeDialog();
    }
  }

  render() {
    const props = this.props;
    return (
      <div>
        <div className={ `${grid.row} ${grid['center-xs']}` }>
          <span>
            <h3>{this.props.t('Address')}</h3>
            <h1 className={`receive-modal-address ${style.address}`}>{props.address}</h1>
            <br />
            <QRCode value={props.address} size={330}/>
            <br /><br />
          </span>
        </div>
        <ActionBar
          secondaryButton={{
            onClick: this.props.closeDialog,
          }}
          primaryButton={{
            label: this.props.t('Copy address to clipboard'),
            className: 'copy-address-button',
            onClick: this.copyAddress.bind(this),
          }} />
      </div>
    );
  }
}

export default ReceiveDialog;
