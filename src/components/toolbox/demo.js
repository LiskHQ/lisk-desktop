import React from 'react';
import BoxDemo from './box/demo';
import ButtonDemo from './buttons/demo';
import CalendarDemo from './calendar/demo';
import CheckBoxDemo from './checkBox/demo';
import DropdownDemo from './dropdown/demo';
import DropdownButtonDemo from './dropdownButton/demo';
import IconDemo from './icon/demo';
import InputDemo from './inputs/demo';
import IllustrationDemo from './illustration/demo';
import HardwareWalletIllustrationDemo from './hardwareWalletIllustration/demo';
import OnboardingDemo from './onboarding/demo';
import TooltipDemo from './tooltip/demo';
import PageHeaderDemo from './pageHeader/demo';
import AnimationDemo from './animation/demo';

const ToolboxDemo = () => (
  <React.Fragment>
    <AnimationDemo />
    <BoxDemo />
    {' '}
    { /* TODO move Box into toolbox folder */ }
    <ButtonDemo />
    <CalendarDemo />
    <CheckBoxDemo />
    <DropdownDemo />
    <DropdownButtonDemo />
    <IconDemo />
    <InputDemo />
    <IllustrationDemo />
    <HardwareWalletIllustrationDemo />
    <OnboardingDemo />
    <PageHeaderDemo />
    <TooltipDemo />
  </React.Fragment>
);

export default ToolboxDemo;
