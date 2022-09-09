import React from 'react';
import WalletVisualDemo from '@wallet/components/walletVisual/demo';
import AutoSuggestDemo from 'src/modules/common/components/AutoSuggest/demo';
import SpinnerDemo from 'src/theme/Spinner/demo';
import SwitcherDemo from 'src/theme/tabs/switcher/demo';
import CalendarDemo from 'src/modules/common/components/calendar/demo';
import IllustrationDemo from 'src/modules/common/components/illustration/demo';
import styles from './demo.css';

const getName = (child) => child.type.name.replace('Demo', '');
const getId = (child) => `/toolbox/${getName(child)}`;

const WithTableOfContents = ({ children }) => (
  <>
    {children.map((child) => (
      <div id={getId(child)} key={getName(child)} className={styles.section}>
        {child}
      </div>
    ))}
    <div className={styles.tableOfContents}>
      {children.map((child) => (
        <a href={`#${getId(child)}`} key={getName(child)}>
          {getName(child)}
        </a>
      ))}
    </div>
  </>
);

const ToolboxDemo = () => (
  <WithTableOfContents>
    <WalletVisualDemo />
    <AutoSuggestDemo />
    <CalendarDemo />
    <IllustrationDemo />
    <SpinnerDemo />
    <SwitcherDemo />
  </WithTableOfContents>
);

export default ToolboxDemo;
