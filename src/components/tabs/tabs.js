import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';

const tabs = [
  'Transactions',
  'Voting',
  'Forging',
];

const getTabs = isDelegate => tabs.filter(t => t !== 'Forging' || isDelegate);

const getIndex = history =>
  tabs.map(t => t.toLowerCase())
    .indexOf(history.location.pathname.split('/')[2]);

const isCurrent = (history, index) =>
  history.location.pathname.indexOf(tabs[index].toLowerCase()) === 6; // after: /main/

const navigate = (history, index) => {
  if (!isCurrent(history, index)) {
    history.push(`/main/${tabs[index].toLowerCase()}`);
  }
};

const Tabs = ({ history, isDelegate, t }) => (
  <ToolboxTabs index={getIndex(history)}
    theme={styles}
    onChange={navigate.bind(null, history)}
    className={`${styles.tabs} main-tabs`}>
    {getTabs(isDelegate).map((tab, index) =>
      <Tab
        key={index}
        label={t(tab)}
        className={styles.tab}
        disabled={isCurrent(history, index)} />)}
  </ToolboxTabs>
);

export default Tabs;
