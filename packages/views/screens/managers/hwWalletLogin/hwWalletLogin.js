import React, { useEffect, useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { subscribeToDevicesList } from '@wallet/utilities/hwManager';
import routes from '@screens/router/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Loading from './loading';
import RequestPin from './requestPin';
import SelectAccount from './selectAccount';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import styles from './hwWalletLogin.css';

const HardwareWalletLogin = ({
  settingsUpdated,
  history,
  network,
  t,
}) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    settingsUpdated({
      token: {
        active: 'LSK',
        list: { BTC: false, LSK: true },
      },
    });

    const deviceListener = subscribeToDevicesList(setDevices);

    return deviceListener.unsubscribe;
  }, []);

  const goBack = () => {
    history.push(routes.login.path);
  };

  return (
    <>
      <div className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep
          className={`${grid['col-xs-10']}`}
        >
          <Loading t={t} devices={devices} network={network} />
          <SelectDevice t={t} devices={devices} />
          <RequestPin t={t} devices={devices} goBack={goBack} />
          <UnlockDevice t={t} devices={devices} goBack={goBack} />
          <SelectAccount
            t={t}
            devices={devices}
            network={network}
            goBack={goBack}
            history={history}
          />
        </MultiStep>
      </div>
    </>
  );
};

export default HardwareWalletLogin;
