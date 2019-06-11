import React from 'react';
import { PrimaryButtonV2, SecondaryButtonV2, TertiaryButtonV2 } from './button';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const ButtonDemo = () => (
  <div>
    <h2>ButtonV2</h2>
    <DemoRenderer>
      <PrimaryButtonV2 onClick={onClick}> Primary </PrimaryButtonV2>
      <SecondaryButtonV2 onClick={onClick}> Secondary </SecondaryButtonV2>
      <DarkWrapper>
        <SecondaryButtonV2 onClick={onClick} className='light'> Light </SecondaryButtonV2>
      </DarkWrapper>
      <TertiaryButtonV2 onClick={onClick}> Tertiary </TertiaryButtonV2>
    </DemoRenderer>

    <h3>Disabled button</h3>
    <DemoRenderer>
      <PrimaryButtonV2 disabled> Primary </PrimaryButtonV2>
      <SecondaryButtonV2 disabled> Secondary </SecondaryButtonV2>
      <DarkWrapper>
        <SecondaryButtonV2 className='light' disabled> Light </SecondaryButtonV2>
      </DarkWrapper>
      <TertiaryButtonV2 disabled> Tertiary </TertiaryButtonV2>
    </DemoRenderer>

    <h3>Button sizes</h3>
    <DemoRenderer>
      <PrimaryButtonV2 > Large </PrimaryButtonV2>
      <PrimaryButtonV2 className='medium'> Medium </PrimaryButtonV2>
      <PrimaryButtonV2 className='small'> Small </PrimaryButtonV2>
      <PrimaryButtonV2 className='extra-small'> Extra Small </PrimaryButtonV2>
    </DemoRenderer>

  </div>
);

export default ButtonDemo;
