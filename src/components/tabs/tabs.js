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

const isCurrent = (history, index) => history.location.pathname.replace('/main/', '') === tabs[index].toLowerCase();

const navigate = (history, index) => {
  if (!isCurrent(history, index)) {
    history.push(`${tabs[index].toLowerCase()}`);
  }
};

const Tabs = props => (
  <ToolboxTabs index={getIndex(props.history)}
    theme={styles}
    onChange={navigate.bind(this, props.history)}
    className={`${styles.tabs} main-tabs`}>
    {getTabs(props.isDelegate).map((tab, index) =>
      <Tab
        key={index}
        label={tab}
        className={styles.tab}
        disabled={isCurrent(props.history, index)} />)}
  </ToolboxTabs>
);

export default Tabs;
