import React, { useEffect, useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import hwManager from '@hardwareWallet/manager/HWManager';
import routes from 'src/routes/routes';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import Loading from './loading';
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

  const getDevices = async () => {
    const response = await hwManager.getDevices();
    setDevices(response);
  };

  useEffect(() => {
    settingsUpdated({
      token: {
        active: 'LSK',
        list: { LSK: true },
      },
    });

    getDevices();
  }, []);

  const goBack = () => {
    history.push(routes.manageAccounts.path);
  };

  return (
    <>
      <div className={`${styles.wrapper} ${grid.row}`}>
        <MultiStep
          className={`${grid['col-xs-10']}`}
        >
          <Loading t={t} devices={devices} network={network} />
          <SelectDevice t={t} devices={devices} />
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
