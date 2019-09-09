import React from 'react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from './button';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const ButtonDemo = () => (
  <div>
    <h2>Button</h2>
    <DemoRenderer>
      <PrimaryButton onClick={onClick}> Primary </PrimaryButton>
      <SecondaryButton onClick={onClick}> Secondary </SecondaryButton>
      <DarkWrapper>
        <SecondaryButton onClick={onClick} className="light"> Light </SecondaryButton>
      </DarkWrapper>
      <TertiaryButton onClick={onClick}> Tertiary </TertiaryButton>
    </DemoRenderer>

    <h3>Disabled button</h3>
    <DemoRenderer>
      <PrimaryButton disabled> Primary </PrimaryButton>
      <SecondaryButton disabled> Secondary </SecondaryButton>
      <DarkWrapper>
        <SecondaryButton className="light" disabled> Light </SecondaryButton>
      </DarkWrapper>
      <TertiaryButton disabled> Tertiary </TertiaryButton>
    </DemoRenderer>

    <h3>Button sizes</h3>
    <DemoRenderer>
      <PrimaryButton> Size l (default) </PrimaryButton>
      <PrimaryButton size="m"> Size m </PrimaryButton>
      <PrimaryButton size="s"> Size s </PrimaryButton>
      <PrimaryButton size="xs"> Size xs </PrimaryButton>
    </DemoRenderer>

  </div>
);

export default ButtonDemo;
