import React from 'react';
import AccountVisualDemo from './accountVisual/demo';
import AnimationDemo from './animation/demo';
import AutoSuggestDemo from './autoSuggest/demo';
import BoxDemo from './box/demo';
import ButtonDemo from './buttons/demo';
import CalendarDemo from './calendar/demo';
import CheckBoxDemo from './checkBox/demo';
import DropdownButtonDemo from './dropdownButton/demo';
import DropdownDemo from './dropdown/demo';
import HardwareWalletIllustrationDemo from './hardwareWalletIllustration/demo';
import IconDemo from './icon/demo';
import IllustrationDemo from './illustration/demo';
import InputDemo from './inputs/demo';
import OnboardingDemo from './onboarding/demo';
import PageHeaderDemo from './pageHeader/demo';
import TooltipDemo from './tooltip/demo';
import styles from './demo.css';

const getName = child => child.type.name.replace('Demo', '');
const getId = child => `/toolbox/${getName(child)}`;

const WithTableOfContents = ({
  children,
}) => (
  <React.Fragment>
    {children.map(child => (
      <div id={getId(child)} key={getName(child)} className={styles.section}>
        {child}
      </div>
    ))}
    <div className={styles.tableOfContents}>
      {children.map(child => (
        <a href={`#${getId(child)}`} key={getName(child)}>
          {getName(child)}
        </a>
      ))}
    </div>
  </React.Fragment>
);

const ToolboxDemo = () => (
  <WithTableOfContents>
    <AccountVisualDemo />
    <AnimationDemo />
    <AutoSuggestDemo />
    <BoxDemo />
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
  </WithTableOfContents>
);

export default ToolboxDemo;
