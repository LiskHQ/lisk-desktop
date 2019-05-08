import React from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButtonV2, TertiaryButtonV2 } from '../toolbox/buttons/button';
import { models } from '../../constants/hwConstants';
import routes from '../../constants/routes';
import svgIcons from '../../utils/svgIcons';
import styles from './selectDevice.css';

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
    return <div>
      <h1>{t('Found several devices, choose the one you’d like to access')}</h1>
      <p>{t('Lisk Hub currently supports Ledger Nano S and Trezor wallets')}</p>

      <div className={`${styles.deviceContainer} hw-container`}>
        {
          devices.map(device => (
            <div key={device.deviceId} className={`${styles.device_box} hw-device`}>
              <img
                className={styles.device_image}
                src={device.model === models.trezorModelT
                  ? svgIcons.icon_trezor_modelT_device
                  : svgIcons.icon_ledger_nano_device}
              />
              <p>{device.model}</p>

              <PrimaryButtonV2
                className={`${styles.device_button} hw-device-button`}
                onClick={() => this.onSelectDevice(device.deviceId)}
              >
                {t('Select device')}
              </PrimaryButtonV2>
            </div>
          ))
        }
      </div>

      <Link to={routes.splashscreen.path}>
        <TertiaryButtonV2>
          {t('Go Back')}
        </TertiaryButtonV2>
      </Link>
    </div>;
  }
}

export default SelectDevice;
