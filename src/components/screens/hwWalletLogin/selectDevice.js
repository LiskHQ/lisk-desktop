import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@constants';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons';
import styles from './selectDevice.css';
import Icon from '../../toolbox/icon';

class SelectDevice extends React.Component {
  constructor(props) {
    super(props);

    this.onSelectDevice = this.onSelectDevice.bind(this);
    this.goBackIfNoDevices = this.goBackIfNoDevices.bind(this);
  }

  componentDidMount() {
    const { devices } = this.props;
    this.goBackIfNoDevices();
    if (devices.length === 1) this.onSelectDevice(devices[0].deviceId);
  }

  componentDidUpdate() {
    this.goBackIfNoDevices();
  }

  goBackIfNoDevices() {
    if (!this.props.devices.length) this.props.prevStep();
  }

  onSelectDevice(deviceId) {
    this.props.nextStep({ deviceId });
  }

  render() {
    const { t, devices } = this.props;
    return (
      <div>
        <h1>{t('Found several devices, choose the one you’d like to access')}</h1>
        <p>{t('Lisk currently supports Ledger Nano S, Ledger Nano X, Trezor One and Trezor T wallets.')}</p>

        <div className={`${styles.deviceContainer} hw-container`}>
          {
          devices.map(device => (
            <div key={device.deviceId} className={`${styles.device_box} hw-device`}>
              <Icon
                className={styles.device_image}
                name={`icon${device.manufacturer}Device`}
              />
              <p>{device.model}</p>

              <PrimaryButton
                className={`${styles.device_button} hw-device-button`}
                onClick={() => this.onSelectDevice(device.deviceId)}
              >
                {t('Select device')}
              </PrimaryButton>
            </div>
          ))
        }
        </div>

        <Link to={routes.login.path}>
          <TertiaryButton>
            {t('Go back')}
          </TertiaryButton>
        </Link>
      </div>
    );
  }
}

export default SelectDevice;
