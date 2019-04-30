import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import HeaderV2 from '../headerV2/headerV2';
import MultiStep from '../multiStep';
import Loading from './loading';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import SelectAccount from './selectAccount';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  constructor() {
    super();

    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    this.setDevices();
  }

  componentDidUpdate() {
    this.setDevices();
  }

  setDevices() {
    // TODO update this when isHarwareWalletConnected is refactored and we have devices in store
    const devices = this.props.settings.isHarwareWalletConnected ? [{}] : [];

    if (devices.length !== this.state.devices.length) {
      this.setState({
        devices,
      });
    }
  }

  render() {
    const { t } = this.props;
    const { devices } = this.state;
    return <React.Fragment>
      <HeaderV2 showSettings={true} />
      <div className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep
          className={`${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>
          <Loading t={t} devices={devices} />
          <SelectDevice t={t} />
          <UnlockDevice t={t} />
          <SelectAccount t={t} />
        </MultiStep>
      </div>
    </React.Fragment>;
  }
}

export default HardwareWalletLogin;
