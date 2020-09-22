import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { subscribeToDevicesList } from '../../../utils/hwManager';
import Loading from './loading';
import MultiStep from '../../shared/multiStep';
import RequestPin from './requestPin';
import SelectAccount from './selectAccount';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import routes from '../../../constants/routes';
import styles from './hwWalletLogin.css';

class HardwareWalletLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { devices: [] };

    this.deviceListener = subscribeToDevicesList(this.updateDeviceList.bind(this));
    this.goBack = this.goBack.bind(this);
  }

  async componentDidMount() {
    this.props.settingsUpdated({
      token: {
        active: 'LSK',
        list: { BTC: false, LSK: true },
      },
    });
  }

  componentWillUnmount() {
    this.deviceListener.unsubscribe();
  }

  updateDeviceList(devices) {
    this.setState({ devices });
  }

  goBack() {
    this.props.history.push(routes.login.path);
  }

  render() {
    const {
      history,
      network,
      t,
    } = this.props;
    const { devices } = this.state;
    return (
      <React.Fragment>
        <div className={`${styles.wrapper} ${grid.row}`}>
          <MultiStep
            className={`${grid['col-xs-10']}`}
          >
            <Loading t={t} devices={devices} network={network} />
            <SelectDevice t={t} devices={devices} />
            <RequestPin t={t} devices={devices} goBack={this.goBack} />
            <UnlockDevice t={t} devices={devices} goBack={this.goBack} />
            <SelectAccount
              t={t}
              devices={devices}
              network={network}
              goBack={this.goBack}
              history={history}
            />
          </MultiStep>
        </div>
      </React.Fragment>
    );
  }
}

export default HardwareWalletLogin;
