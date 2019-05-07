import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import HeaderV2 from '../headerV2/headerV2';
import MultiStep from '../multiStep';
import Loading from './loading';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import SelectAccount from './selectAccount';
import { getDeviceList } from '../../utils/hwWallet';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  async componentDidMount() {
    await this.updateDeviceList(null);
  }

  async updateDeviceList(deviceList) {
    if (!deviceList) {
      deviceList = await getDeviceList();
    }
    this.props.devicesListUpdated(deviceList);
  }

  render() {
    const { devices, t, liskAPIClient } = this.props;
    return <React.Fragment>
      <HeaderV2 showSettings={true} />
      <div className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep
          className={`${grid['col-xs-10']}`}>
          <SelectAccount t={t} liskAPIClient={liskAPIClient} />
          <Loading t={t} devices={devices} />
          <SelectDevice t={t} devices={devices} />
          <UnlockDevice t={t} devices={devices} />
        </MultiStep>
      </div>
    </React.Fragment>;
  }
}

export default HardwareWalletLogin;
