import React from 'react';
import QRCode from 'qrcode.react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import ReceiveForm from './requestForm';
import { FontIcon } from '../../../fontIcon';
import { Button, ActionButton } from '../../../toolbox/buttons/button';
import CopyToClipboard from '../../../copyToClipboard/index';
import inputValidator from '../../../../utils/inputValidator';
import styles from '../../receive.css';

class Confirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipient: { value: props.address },
      reference: { value: '' },
      amount: { value: '' },
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(value, name, required = true, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string'
          ? error
          : inputValidator.validateInput(this.props.t, name, value, required),
      },
    });
  }

  render() {
    let link = `lisk://wallet/send?recipient=${this.props.address}`;
    link = `${link}&amount=${this.state.amount.value}`;
    link = (this.state.reference.value) ? `${link}&reference=${this.state.reference.value}` : link;
    const text = `mailto:?subject=Requesting ${this.state.amount.value} LSK to ${this.props.address}&body=Hey there,
    here is a link you can use to send me ${this.state.amount.value} LSK via your wallet: ${encodeURIComponent(link)}`;

    return (
      <div>
        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <header className={`${grid['col-xs-10']} ${grid['col-sm-10']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <h3>{this.props.t('Request LSK')}</h3>
          </header>
        </div>
        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${styles.qrCode} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <QRCode value={link} />
          </div>
          <div className={`${styles.transaction} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <ReceiveForm
              t={this.props.t}
              address={this.props.address}
              amount={this.state.amount.value}
              error={this.state.amount.error}
              onAmountChange={value => this.onInputChange(value, 'amount', true)}
              onReferenceChange={value => this.onInputChange(value, 'reference', false)}
              reference={this.state.reference}
            />
            <a
              href={text}
              className={'email-link'} >
              {this.props.t('Send request via E-mail')}
              <FontIcon value='external-link'/>
            </a>
          </div>
        </div>
        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${styles.copyToClipboard} ${grid['col-xs-10']} ${grid['col-sm-10']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <CopyToClipboard
              value={link}
              className={`${styles.copy} request-link`}
            />
          </div>
        </div>
        <footer className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${grid['col-xs-3']} ${grid['col-sm-3']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <Button
              className={'back'}
              // prevStep() should be check it as the behavior is not right
              // the reset shouldn't be use for skip
              onClick={() => this.props.prevStep({ reset: true })}>
              {this.props.t('Back')}
            </Button>
          </div>
          <div className={`${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <ActionButton
              className={'okay-button'}
              disabled={this.isFormComplete()}
              onClick={() => this.props.goToTransationPage()}
              >
              {this.props.t("Okay, I'm done")}
            </ActionButton>
          </div>
        </footer>
      </div>
    );
  }
}

export default Confirmation;
