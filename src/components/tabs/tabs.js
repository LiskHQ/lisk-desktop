import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';

const getTabs = (isDelegate, tabs) => tabs.filter(t => t !== 'Forging' || isDelegate);

const getIndex = (history, tabs) =>
  tabs.map(t => t.toLowerCase())
    .indexOf(history.location.pathname.split('/')[2]);

const isCurrent = (history, index, tabs) =>
  history.location.pathname.indexOf(tabs[index].toLowerCase()) === 6; // after: /main/

const navigate = (history, tabs, index) => {
  if (!isCurrent(history, index, tabs)) {
    history.push(`/main/${tabs[index].toLowerCase()}`);
  }
};

const Tabs = ({ history, isDelegate, t }) => {
  const tabs = [
    t('Transactions'),
    t('Voting'),
    t('Forging'),
  ];

  return (
    <ToolboxTabs index={getIndex(history, tabs)}
      theme={styles}
      onChange={navigate.bind(null, history, tabs)}
      className={`${styles.tabs} main-tabs`}>
      {getTabs(isDelegate, tabs).map((tab, index) =>
        <Tab
          key={index}
          label={tab}
          className={styles.tab}
          disabled={isCurrent(history, index, tabs)} />)}
    </ToolboxTabs>
  );
};

export default Tabs;
