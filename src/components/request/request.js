import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import QRCode from 'qrcode.react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { FontIcon } from '../fontIcon';
import { Button, ActionButton } from './../toolbox/buttons/button';
import CopyToClipboard from '../copyToClipboard/index';
import RequestForm from './requestForm';
import Box from '../box';
import inputValidator from '../../utils/inputValidator';
import styles from './newRequest.css';

class Request extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      recipient: { value: props.address },
      reference: { value: '' },
      amount: { value: '' },
      enableMessage: true,
    };

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.closeMessage = this.closeMessage.bind(this);
  }

  next() {
    const { step } = this.state;
    if (step <= 1) {
      this.setState({ step: step + 1 });
    }
  }

  back() {
    const { step } = this.state;

    if (step === 1) {
      this.props.history.push('/wallet');
    } else if (step > 1) {
      this.setState({ step: step - 1 });
    }
  }

  closeMessage() {
    this.setState({ enableMessage: false });
  }

  onInputChange(value, name, required = true, error) {
    const { t } = this.props;

    this.setState({
      [name]: {
        value,
        error: typeof error === 'string'
          ? error
          : inputValidator.validateInput(t, name, value, required),
      },
    });
  }

  isFormComplete() {
    const { recipient, amount, reference } = this.state;

    return (!!recipient.error ||
      !recipient.value ||
      !!reference.error ||
      !!amount.error ||
      !amount.value);
  }

  renderAddressOrLink() {
    const { step } = this.state;
    const { address } = this.props;
    let text;

    if (step === 1) {
      text = address;
    } else {
      text = `lisk://wallet?recipient=${address}`;
    }

    return (
      <CopyToClipboard
        value={`${text}`}
        className={styles.copy}
      />
    );
  }

  renderSendRequestByEmail() {
    const { t, address } = this.props;

    const link = `lisk://wallet?recipient=${address}`;
    const text = `mailto:?subject=Requesting LSK to ${address}&body=Hey there,
      here is a link you can use to send me LSK via your wallet: ${encodeURIComponent(link)}`;

    return (
      <a href={text}>
        {t('Send request via E-mail')}
        <FontIcon value='external-link'/>
      </a>
    );
  }

  render() {
    const { t, address } = this.props;
    const {
      amount,
      enableMessage,
      reference,
      step,
    } = this.state;
    const disabled = step === 2 ? this.isFormComplete() : false;
    const isEnable = step === 2 && enableMessage ? styles.isEnable : null;

    return (
      <Box className={styles.wrapper}>
        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <header className={`${grid['col-xs-10']} ${grid['col-sm-10']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <h3>{t('Receive LSK')}</h3>
          </header>
        </div>

        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${styles.qrCode} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <QRCode value={address} />
            { this.renderAddressOrLink() }
          </div>
          <div className={`${styles.transaction} ${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            {
              step === 1
              ? (<p>
              {t('This is your Lisk ID shown as a QR code. You can scan it with our Lisk Mobileapp available on Google Play & the AppStore or any QR code reader.')}
                </p>)
              : (<RequestForm
                  t={t}
                  address={address}
                  amount={amount.value}
                  error={amount.error}
                  onAmountChange={text => this.onInputChange(text, 'amount', true)}
                  onReferenceChange={text => this.onInputChange(text, 'reference', false)}
                  reference={reference}
                />)
            }
            { this.renderSendRequestByEmail() }
          </div>
        </div>

        <footer className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']}`}>
          <div className={`${grid['col-xs-3']} ${grid['col-sm-3']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <Button
              onClick={this.back}>
              {t('Back')}
            </Button>
          </div>

          <div className={`${grid['col-xs-5']} ${grid['col-sm-5']} ${grid['col-md-4']} ${grid['col-lg-3']}`}>
            <ActionButton
              disabled={disabled}
              onClick={this.next}>
              {
                step === 1
                ? t('Request specific amount')
                : t("Okay, I'm done")
              }
            </ActionButton>
          </div>
        </footer>

        <div className={`${grid.row} ${grid['center-xs']} ${grid['center-sm']} ${grid['center-md']} ${grid['center-lg']} ${styles.message} ${isEnable}`}>
          <div className={`${grid['col-xs-10']} ${grid['col-sm-8']} ${grid['col-md-8']} ${grid['col-lg-6']}`}>
            <div className={styles.closeIcon}
              onClick={() => this.closeMessage()}>
              <FontIcon value='close'/>
            </div>
            <h3>{t('How it works')}</h3>
            <p>{t(`Hub enables you to customize a link. Once shared with your peers,
              this link can be used to open any Lisk application and pre-fill the data for you.`)}</p>
            <p>{t('You can customize amount & message.')}</p>
          </div>
        </div>
      </Box>
    );
  }
}


Request.propTypes = {
  children: PropTypes.element,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  address: state.account.address,
});

export default connect(mapStateToProps)(translate()(Request));
