import React from 'react';
import AccountVisualDemo from './accountVisual/demo';
import AnimationDemo from './animation/demo';
import AutoSuggestDemo from './autoSuggest/demo';
import CalendarDemo from './calendar/demo';
import HardwareWalletIllustrationDemo from './hardwareWalletIllustration/demo';
import IllustrationDemo from './illustration/demo';
import OnboardingDemo from './onboarding/demo';
import PageHeaderDemo from './pageHeader/demo';
import PassphraseInputDemo from './passphraseInput/demo';
import SpinnerDemo from './spinner/demo';
import SwitcherDemo from './switcher/demo';
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
    <CalendarDemo />
    <IllustrationDemo />
    <HardwareWalletIllustrationDemo />
    <OnboardingDemo />
    <PageHeaderDemo />
    <PassphraseInputDemo />
    <SpinnerDemo />
    <SwitcherDemo />
  </WithTableOfContents>
);

export default ToolboxDemo;
