import React from 'react';
import BoxDemo from '../box/demo';
import ButtonDemo from './buttons/demo';
import CalendarDemo from './calendar/demo';
import CheckBoxDemo from './checkBox/demo';
import DropdownDemo from './dropdownV2/demo';
import DropdownButtonDemo from './dropdownButton/demo';
import IconDemo from './icon/demo';
import InputDemo from './inputsV2/demo';
import IllustrationDemo from './illustration/demo';
import OnboardingDemo from './onboarding/demo';
import TooltipDemo from './tooltip/demo';
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
    <OnboardingDemo />
    <TooltipDemo />
  </React.Fragment>
);

export default ToolboxDemo;
