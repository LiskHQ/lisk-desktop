import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';

const tabs = [
  'Transactions',
  'Voting',
  'Forging',
];

const getTabs = isDelegate => (tabs.filter(t => t !== 'Forging' || isDelegate));

const getIndex = history => (
  tabs.map(t => t.toLowerCase())
    .indexOf(history.location.pathname.replace('/main/', '')));

const Tabs = props => (
  <ToolboxTabs index={getIndex(props.history)}
    onChange={index => props.history.push(`${tabs[index].toLowerCase()}`)}
    className={`${styles.tabs} main-tabs`}>
    {getTabs(props.isDelegate).map((tab, index) =>
      <Tab key={index} label={tab} className={styles.tab} />)}
  </ToolboxTabs>
);

export default Tabs;
