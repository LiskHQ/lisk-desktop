import React from 'react';
import DemoRenderer from '../demoRenderer';
import HardwareWalletIllustration from '.';
import { loginType } from '../../../constants/hwConstants';

const HardwareWalletIllustrationDemo = () => (
  <React.Fragment>
    <h2>HardwareWalletIllustration</h2>
    { Object.values(loginType).map(type => (
      <DemoRenderer key={type}>
        <HardwareWalletIllustration
          account={{ loginType: type }}
          size="s"
        />
      </DemoRenderer>
    )) }
  </React.Fragment>
);

export default HardwareWalletIllustrationDemo;
