import React from 'react';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox/lib/tabs';
import Drawer from 'react-toolbox/lib/drawer';
import styles from './mainMenu.css';
import logo from '../../assets/images/Lisk-Logo.svg';
import * as menuLogos from '../../assets/images/main-menu-icons/*.svg'; //eslint-disable-line
import { FontIcon } from '../fontIcon';
import Setting from '../setting';

const getTabs = (isDelegate, tabs) => tabs.filter(t => t.id !== 'forging' || isDelegate);

const getIndex = (history, tabs) =>
  tabs.map(t => t.id)
    .indexOf(history.location.pathname.split('/')[2]);

const isCurrent = (history, index, tabs) =>
  history.location.pathname.indexOf(tabs[index].id) === 6; // after: /main/

const TabTemplate = ({ img, label }) => (
  <div>
    <img src={img} />
    <span>{label}</span>
  </div>
);


class MainMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
    };
  }

  menuToggle() {
    this.setState({ active: !this.state.active });
  }

  navigate(history, tabs, index) {
    if (!isCurrent(history, index, tabs)) {
      this.setState({ active: false });
      history.push(`/main/${tabs[index].id}`);
    }
  }

  render() {
    const { history, isDelegate, t } = this.props;
    const tabs = [
      {
        label: t('Dashboard'),
        id: 'dashboard',
        image: menuLogos.dashboard,
      }, {
        label: t('Wallet'),
        id: 'transactions',
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
        label: t('Forging'),
        id: 'forging',
        image: menuLogos.sidechains,
      }, {
        label: t('Sidechains'),
        id: 'sidechains',
        image: menuLogos.sidechains,
      }, {
        label: t('Search'),
        id: 'search',
        image: menuLogos.search,
      },
    ];
    const filterTabs = getTabs(isDelegate, tabs);
    return (
      <div className={styles.sideBarWrapper}>
        <img src={logo} className={styles.logo} />
        <ToolboxTabs index={getIndex(history, tabs)}
          theme={styles}
          onChange={this.navigate.bind(this, history, filterTabs)}
          disableAnimatedBottomBorder={true}
          className={`${styles.tabs} main-tabs`}>
          {filterTabs.map(({ label, image, id }, index) =>
            <Tab
              key={index}
              label={<TabTemplate label={label} img={image} />}
              className={styles.tab}
              id={id}
              disabled={isCurrent(history, index, tabs)} />)}
        </ToolboxTabs>
        <div onClick={this.menuToggle.bind(this)}
          className={`${styles.more} more-menu`}>
          <FontIcon value='more' className={styles.readMoreIcon} />
          <span className={styles.readMoreText}>{t('more')}</span>
        </div>
        <Drawer theme={styles}
          className='drawer'
          active={this.state.active}
          onOverlayClick={this.menuToggle.bind(this)}>
          <div>
            <header className={styles.header}>
              <img src={logo} className={styles.logo} />
              <FontIcon value='close' className={styles.close} onClick={this.menuToggle.bind(this)} />
            </header>
            <ToolboxTabs index={getIndex(history, tabs)}
              theme={styles}
              onChange={this.navigate.bind(this, history, filterTabs)}
              disableAnimatedBottomBorder={true}
              className={`${styles.tabs} main-tabs`}>
              {filterTabs.map(({ label, image, id }, index) =>
                <Tab
                  key={index}
                  label={<TabTemplate label={label} img={image} />}
                  id={id}
                  disabled={isCurrent(history, index, tabs)} />)}
            </ToolboxTabs>
          </div>
          <Setting />
        </Drawer>
      </div>
    );
  }
}

export default MainMenu;
