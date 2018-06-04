import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox/lib/tabs';
import Drawer from 'react-toolbox/lib/drawer';
import MenuBar from '../menuBar';
import styles from './mainMenu.css';
import logo from '../../assets/images/logo-beta.svg';
import * as menuLogos from '../../assets/images/main-menu-icons/*.svg'; //eslint-disable-line
import { FontIcon } from '../fontIcon';
import routes from '../../constants/routes';

const getIndex = (history, tabs) => {
  if (history.location.pathname.includes('explorer')) return 2;

  let index = -1;
  tabs.map(t => new RegExp(`${t.route}(\\/?)`)).forEach((item, i) => {
    if (history.location.pathname.match(item)) {
      index = i;
    }
  });
  return index;
};

const isCurrent = (history, index, tabs) =>
  history.location.pathname.indexOf(tabs[index].route) === 6; // after: /main/

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
      setting: false,
      index: 0,
    };
  }

  menuToggle() {
    const setting = !this.state.active ? false : this.state.setting;
    this.setState({ active: !this.state.active, setting });
  }

  navigate(history, tabs, index) {
    if (!isCurrent(history, index, tabs)) {
      this.setState({ active: false, index });
      history.replace(tabs[index].route);
    }
  }

  settingToggle() {
    this.setState({
      setting: !this.state.setting,
    });
  }

  render() {
    const {
      history, t, showDelegate, account,
    } = this.props;
    const tabs = [
      {
        label: t('Dashboard'),
        route: `${routes.dashboard.path}`,
        id: 'dashboard',
        image: menuLogos.dashboard,
      }, {
        label: t('Wallet'),
        route: `${routes.wallet.path}`,
        id: 'transactions',
        image: menuLogos.wallet,
      }, {
      /* TODO: uncomment when the page is created
        label: t('Buy Lisk'),
        route: '/main/buyLisk',
        id: 'buyLisk',
        image: menuLogos.buyLisk,
      }, {
      */
        label: t('Explorer'),
        route: `${routes.explorer.path}${routes.search.path}`,
        id: 'explorer',
        image: menuLogos.search,
      }, {
        label: t('Sidechains'),
        route: `${routes.sidechains.path}`,
        id: 'sidechains',
        image: menuLogos.sidechains,
      }, {
        label: t('Settings'),
        route: `${routes.setting.path}`,
        id: 'settings',
        image: menuLogos.settings,
      },
    ];

    if (showDelegate) {
      tabs.splice(tabs.length - 2, 0, {
        label: t('Delegates'),
        id: 'delegates',
        route: `${routes.delegates.path}`,
        image: menuLogos.delegates,
      });
    }

    const itemShouldBeDisabled = index =>
      (isCurrent(history, index, tabs) || !account.address) && index !== 2;

    return (
      <Fragment>
        <aside className={styles.aside}>
          <div className={styles.sideBarWrapper}>
            <Link to={`${routes.dashboard.path}`}><img src={logo} className={styles.logo} /></Link>
            <ToolboxTabs index={getIndex(history, tabs)}
              theme={styles}
              onChange={this.navigate.bind(this, history, tabs)}
              disableAnimatedBottomBorder={true}
              className={`${styles.tabs} main-tabs`}>
              {tabs.map(({ label, image, id }, index) =>
                <Tab
                  key={index}
                  label={<TabTemplate label={label} img={image} />}
                  className={styles.tab}
                  id={id}
                  disabled={itemShouldBeDisabled(index)}
                />)}
            </ToolboxTabs>
            <Drawer theme={styles}
              className='drawer'
              active={this.state.active}
              onOverlayClick={this.menuToggle.bind(this)}>
              <div>
                <header className={styles.header}>
                  <Link to={`${routes.dashboard.path}`}><img src={logo} className={styles.logo} /></Link>
                  <FontIcon value='close' className={styles.close} onClick={this.menuToggle.bind(this)} />
                </header>
                <ToolboxTabs index={getIndex(history, tabs)}
                  theme={styles}
                  onChange={this.navigate.bind(this, history, tabs)}
                  disableAnimatedBottomBorder={true}
                  className={`${styles.tabs} main-tabs`}>
                  {tabs.map(({ label, image, id }, index) =>
                    <Tab
                      key={index}
                      label={<TabTemplate label={label} img={image} />}
                      id={id}
                      disabled={itemShouldBeDisabled(index)}
                    />)}
                </ToolboxTabs>
              </div>
            </Drawer>
          </div>
        </aside>
        <MenuBar
          menuToggle={this.menuToggle.bind(this)}
          settingToggle={this.settingToggle.bind(this)}
          menuStatus={this.state.active}
          settingStatus={this.state.setting} />
      </Fragment>
    );
  }
}

export default MainMenu;
