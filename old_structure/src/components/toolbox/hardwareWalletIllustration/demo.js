import React from 'react';
import { loginTypes } from '@constants';
import DemoRenderer from '../demoRenderer';
import HardwareWalletIllustration from '.';

const HardwareWalletIllustrationDemo = () => (
  <>
    <h2>HardwareWalletIllustration</h2>
    { Object.keys(loginTypes).map(type => (
      <DemoRenderer key={type}>
        <HardwareWalletIllustration
          account={{ loginType: type }}
          size="s"
        />
      </DemoRenderer>
    )) }
  </>
);

export default HardwareWalletIllustrationDemo;
