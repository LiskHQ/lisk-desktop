// istanbul ignore file
import React from 'react';
import { TertiaryButton } from '../toolbox/buttons/button';
import illustration from '../../assets/images/illustrations/illustration-ledger-nano-light.svg';
import routes from '../../constants/routes';

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
    /* istanbul ignore next */
    clearTimeout(this.timeout);
  }

  navigateIfNeeded() {
    const selectedDevice = this.props.devices.find(d => d.deviceId === this.props.deviceId);
    if (!selectedDevice) this.props.prevStep({ reset: true });
    clearTimeout(this.timeout);
    if (selectedDevice && (selectedDevice.openApp || /(trezor(\s?))/ig.test(selectedDevice.model))) {
      this.props.nextStep({ device: selectedDevice });
    } else {
      this.timeout = setTimeout(this.checkLedger, 1000);
    }
  }

  checkLedger() {
    /* istanbul ignore else */
    if (!ipc) {
      this.setState({ isLoading: false });
    } else {
      if (this.state.isLoading) {
        ipc.once('checkLedger.done', () => this.setState({ isLoading: false }));
      }
      ipc.send('checkLedger', { id: this.props.deviceId });
    }
  }

  render() {
    const {
      t,
      history,
      devices,
      deviceId,
    } = this.props;
    const selectedDevice = devices.find(d => deviceId && d.deviceId === deviceId) || {};
    return !this.state.isLoading && !!selectedDevice.model && (
      <div>
        <h1>{t('{{deviceModel}} connected! Open the Lisk app on the device', { deviceModel: selectedDevice.model })}</h1>
        <p>
          {
          t('If you’re not sure how to do this please follow the')
        }
          {' '}
          <a
            href="https://support.ledger.com/hc/en-us/categories/115000820045-Ledger-Nano-S"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Official guidelines')}
          </a>
        </p>
        <img src={illustration} />
        <TertiaryButton onClick={() => { history.push(routes.splashscreen.path); }}>
          {t('Go Back')}
        </TertiaryButton>
      </div>
    );
  }
}

export default UnlockDevice;
