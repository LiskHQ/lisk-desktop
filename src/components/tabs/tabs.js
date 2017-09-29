import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';

const getTabs = (isDelegate, tabs) => tabs.filter(t => t.id !== 'forging' || isDelegate);

const getIndex = (history, tabs) =>
  tabs.map(t => t.id)
    .indexOf(history.location.pathname.split('/')[2]);

const isCurrent = (history, index, tabs) =>
  history.location.pathname.indexOf(tabs[index].id) === 6; // after: /main/

const navigate = (history, tabs, index) => {
  if (!isCurrent(history, index, tabs)) {
    history.push(`/main/${tabs[index].id}`);
  }
};

const Tabs = ({ history, isDelegate, t }) => {
  const tabs = [
    {
      label: t('Transactions'),
      id: 'transactions',
    }, {
      label: t('Voting'),
      id: 'voting',
    }, {
      label: t('Forging'),
      id: 'forging',
    },
  ];

  return (
    <ToolboxTabs index={getIndex(history, tabs)}
      theme={styles}
      onChange={navigate.bind(null, history, tabs)}
      className={`${styles.tabs} main-tabs`}>
      {getTabs(isDelegate, tabs).map(({ label }, index) =>
        <Tab
          key={index}
          label={label}
          className={styles.tab}
          disabled={isCurrent(history, index, tabs)} />)}
    </ToolboxTabs>
  );
};

export default Tabs;
