import React from 'react';
import { TertiaryButtonV2 } from '../toolbox/buttons/button';
import illustration from '../../assets/images/illustrations/illustration-ledger-nano-light.svg';

const { ipc } = window;

class UnlockDevice extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
    };

    this.timeout = null;
    this.checkLedger = this.checkLedger.bind(this);
  }

  componentDidMount() {
    this.checkLedger();
  }

  componentDidUpdate() {
    this.navigateIfNeeded();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  navigateIfNeeded() {
    const selectedDevice = this.props.devices.find(d => d.deviceId === this.props.deviceId);
    if (!selectedDevice) this.props.prevStep();
    if (selectedDevice && (selectedDevice.openApp || /(trezor(\s?))/ig.test(selectedDevice.model))) {
      clearTimeout(this.timeout);
      this.props.nextStep({ device: selectedDevice });
    } else {
      this.timeout = setTimeout(this.checkLedger, 1000);
    }
  }

  checkLedger() {
    if (!ipc) {
      this.setState({ isLoading: false });
      return;
    }
    if (this.state.isLoading) {
      ipc.once('checkLedger.done', () => this.setState({ isLoading: false }));
    }
    ipc.send('checkLedger', { id: this.props.deviceId });
  }

  render() {
    const { t, prevStep, deviceModel = 'Ledger S' } = this.props;
    return !this.state.isLoading && (
      <React.Fragment>
        <h1>{t('{{deviceModel}} connected! Open the Lisk app on the device', { deviceModel })}</h1>
        <p>
        {
          t('If you’re not sure how to do this please follow the')
        } <a href="https://support.ledger.com/hc/en-us/categories/115000820045-Ledger-Nano-S"
          target="_blank"
          rel='noopener noreferrer'
          >
            {t('Official guidelines')}
          </a>
        </p>
        <img src={illustration} />
        <TertiaryButtonV2 onClick={prevStep}>
          {t('Go Back')}
        </TertiaryButtonV2>
      </React.Fragment>
    );
  }
}

export default UnlockDevice;
