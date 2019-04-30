import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import HeaderV2 from '../headerV2/headerV2';
import MultiStep from '../multiStep';
import Loading from './loading';
import SelectDevice from './selectDevice';
import UnlockDevice from './unlockDevice';
import SelectAccount from './selectAccount';
import styles from './hwWalletLogin.css';

const HardwareWallletLogin = ({ t }) => (
  <React.Fragment>
    <HeaderV2 showSettings={true} />
    <div className={`${styles.wrapper} ${grid.row}`}>
      <MultiStep
        className={`${grid['col-xs-12']} ${grid['col-md-10']} ${grid['col-lg-8']}`}>
        <Loading t={t} />
        <SelectDevice t={t} />
        <UnlockDevice t={t} />
        <SelectAccount t={t} />
      </MultiStep>
    </div>
  </React.Fragment>
);

export default translate()(HardwareWallletLogin);
