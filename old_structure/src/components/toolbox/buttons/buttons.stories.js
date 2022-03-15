import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import {
  PrimaryButton, SecondaryButton, TertiaryButton, WarningButton,
} from '.';

const DarkWrapper = ({ children, display }) => (
  <span style={{
    display, background: '#0c152e', padding: 20,
  }}
  >
    {children}
  </span>
);

storiesOf('Toolbox', module)
  .add('Button', () => (
    <StoryWrapper>
      <h3>Enabled State</h3>
      <PrimaryButton onClick={action('clicked')}>Primary Button</PrimaryButton>
      <SecondaryButton onClick={action('clicked')}>Secondary Button</SecondaryButton>
      <DarkWrapper>
        <SecondaryButton className="light" onClick={action('clicked')}>Secondary Button - Light</SecondaryButton>
      </DarkWrapper>
      <TertiaryButton onClick={action('clicked')}>Tertiary Button</TertiaryButton>
      <WarningButton onClick={action('clicked')}>Warning Button</WarningButton>
      <h3>Disabled State</h3>
      <PrimaryButton disabled onClick={action('clicked')}>Primary Button</PrimaryButton>
      <SecondaryButton disabled onClick={action('clicked')}>Secondary Button</SecondaryButton>
      <DarkWrapper>
        <SecondaryButton className="light" disabled onClick={action('clicked')}>Secondary Button - Light</SecondaryButton>
      </DarkWrapper>
      <TertiaryButton disabled onClick={action('clicked')}>Tertiary Button</TertiaryButton>
      <h3>Button sizes</h3>
      <PrimaryButton onClick={action('clicked')}> Size l (default) </PrimaryButton>
      <PrimaryButton size="m" onClick={action('clicked')}> Size m </PrimaryButton>
      <PrimaryButton size="s" onClick={action('clicked')}> Size s </PrimaryButton>
      <PrimaryButton size="xs" onClick={action('clicked')}> Size xs </PrimaryButton>
    </StoryWrapper>
  ));
