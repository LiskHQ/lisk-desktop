import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';
import logo from '../../assets/images/Lisk-Logo.svg';
import * as menuLogos from '../../assets/images/sidebar-icons/*.svg'; //eslint-disable-line

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

const Setting = ({ label }) => (
  <div>
    <i className='material-icons'>settings</i>
    <span>{label}</span>
  </div>
);

const TabTemplate = ({ img, label }) => (
  <div>
    <img src={img} />
    <span>{label}</span>
  </div>
);


const Tabs = ({ history, isDelegate, t }) => {
  const tabs = [
    {
      label: t('Dashboard'),
      id: 'transactions',
      image: menuLogos.dashboard,
    }, {
      label: t('Delegates'),
      id: 'voting',
      image: menuLogos.delegates,
    }, {
      label: t('Forging'),
      id: 'forging',
      image: menuLogos.sidechains,
    }, {
      label: t('Wallet'),
      id: 'wallet',
      image: menuLogos.wallet,
    }, {
      label: t('Buy Lisk'),
      id: 'butLisk',
      image: menuLogos.buyLisk,
    }, {
      label: t('Delegates'),
      id: 'voting',
      image: menuLogos.delegates,
    }, {
      label: t('Sidechains'),
      id: 'sidechains',
      image: menuLogos.sidechains,
    }, {
      label: t('Search'),
      id: 'search',
      image: menuLogos.search,
    }, {
      label: t('Forging'),
      id: 'forging',
      image: menuLogos.sidechains,
    }, {
      label: t('Setting'),
      id: 'setting',
      image: menuLogos.search,
    },
  ];
  const filterTabs = getTabs(isDelegate, tabs);
  return (
    <div className={styles.sideBarWrapper}>
      <img src={logo} className={styles.logo} />
      <ToolboxTabs index={getIndex(history, tabs)}
        theme={styles}
        onChange={navigate.bind(null, history, tabs)}
        disableAnimatedBottomBorder={true}
        className={`${styles.tabs} main-tabs`}>
        {filterTabs.filter((item, index) => index < filterTabs.length - 1)
          .map(({ label, image, id }, index) =>
            <Tab
              key={index}
              label={<TabTemplate label={label} img={image} />}
              className={styles.tab}
              id={id}
              disabled={isCurrent(history, index, tabs)} />)}
        <Tab
          key={tabs[tabs.length - 1].index}
          className={`${styles.tab} ${styles.setting}`}
          label={<Setting label={tabs[tabs.length - 1].label} />} />
      </ToolboxTabs>
    </div>
  );
};

export default Tabs;
