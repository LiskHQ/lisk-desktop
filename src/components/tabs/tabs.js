import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import styles from './tabs.css';
import logo from '../../assets/images/Lisk-Logo.svg';
import * as menuLogos from '../../assets/images/sidebar-icons/*.svg'; //eslint-disable-line

console.log(menuLogos);
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

const Temp = props => (
  <div>
    <img src={props.img} />
    <span>{props.label}</span>
  </div>
);
const Tabs = ({ history, isDelegate, t }) => {
  const tabs = [
    {
      label: t('Dashboard'),
      id: 'transactions',
      image: menuLogos.dashboard,
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
    },
  ];
  // let tabContent;
  return (
    <div className={styles.sideBarWrapper}>
      <img src={logo} className={styles.logo} />
      <ToolboxTabs index={getIndex(history, tabs)}
        theme={styles}
        onChange={navigate.bind(null, history, tabs)}
        disableAnimatedBottomBorder={true}
        className={`${styles.tabs} main-tabs`}>
        {getTabs(isDelegate, tabs).map(({ label, image }, index) =>
          <Tab
            key={index}
            label={<Temp label={label} img={image} />}
            className={styles.tab}
            disabled={isCurrent(history, index, tabs)} />)}
      </ToolboxTabs>
    </div>
  );
};

export default Tabs;
