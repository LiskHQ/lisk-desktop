import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import HeaderV2 from '../headerV2/index';
import MultiStep from '../multiStep';
import Loading from './loading';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import SelectAccount from './selectAccount';
import { getDeviceList } from '../../utils/hwWallet';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  async componentDidMount() {
    await this.updateDeviceList();
  }

  async updateDeviceList() {
    const deviceList = await getDeviceList();
    this.props.updateDeviceList(deviceList);
  }

  render() {
    const {
      devices,
      history,
      liskAPIClient,
      t,
    } = this.props;
    return <React.Fragment>
      <HeaderV2 showSettings={true} hideNetwork={true} />
      <div className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep
          className={`${grid['col-xs-10']}`}>
          <Loading t={t} devices={devices} />
          <SelectDevice t={t} devices={devices} />
          <UnlockDevice t={t} devices={devices} history={history} />
          <SelectAccount t={t} liskAPIClient={liskAPIClient} history={history} />
        </MultiStep>
      </div>
    </React.Fragment>;
  }
}

export default HardwareWalletLogin;
