import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox/lib/tabs';
import Drawer from 'react-toolbox/lib/drawer';

import { parseSearchParams } from './../../utils/searchParams';
import MenuBar from '../menuBar';
import styles from './mainMenu.css';
import logo from '../../assets/images/Lisk-Logo.svg';
import * as menuLogos from '../../assets/images/main-menu-icons/*.svg'; //eslint-disable-line
import { FontIcon } from '../fontIcon';
import routes from '../../constants/routes';

const getIndex = (history, tabs) => {
  let index = -1;
  tabs.map(t => new RegExp(`${t.route}(\\/?)`)).forEach((item, i) => {
    if (history.location.pathname.match(item)) {
      index = i;
    }
  });
  return index;
};

const TabTemplate = ({ img, label, isFontIcon }) => (
  <div>
    {
      !isFontIcon ?
      <img src={img} /> :
      <FontIcon className={styles.bottomIcon} value={img} />
    }
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
      showFeedback: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const params = parseSearchParams(nextProps.history.location.search);
    this.setState({ showFeedback: params.showFeedback });
  }

  menuToggle() {
    const setting = !this.state.active ? false : this.state.setting;
    this.setState({ active: !this.state.active, setting });
  }

  navigate(history, tabs, index) {
    this.setState({ active: false, index });
    if (tabs[index].id === 'feedback') {
      this.props.showFeedback({
        childComponentProps: {
          title: this.props.t('Tell us what you think'),
        },
      });
      return;
    }
    history.push(tabs[index].route);
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
    let tabs = [
      {
        label: t('Dashboard'),
        route: `${routes.dashboard.path}`,
        id: 'dashboard',
        image: menuLogos.dashboard,
        enabledWhenNotLoggedIn: true,
      }, {
        label: t('Wallet'),
        route: `${routes.wallet.path}`,
        id: 'transactions',
        image: menuLogos.wallet,
      }, {
        label: t('Delegates'),
        id: 'delegates',
        route: `${routes.delegates.path}`,
        image: menuLogos.delegates,
      }, {
        label: t('Sidechains'),
        route: `${routes.sidechains.path}`,
        id: 'sidechains',
        image: menuLogos.sidechains,
      },
    ];

    let bottomMenuTabs = [
      {
        label: t('Settings'),
        route: `${routes.setting.path}`,
        id: 'settings',
        image: 'settings',
        enabledWhenNotLoggedIn: true,
      },
      {
        label: t('Feedback'),
        id: 'feedback',
        image: 'conversation',
        enabledWhenNotLoggedIn: true,
      },
      {
        label: t('Help'),
        route: `${routes.help.path}`,
        id: 'help',
        image: 'logo-icon',
        enabledWhenNotLoggedIn: true,
      },
    ];

    if (!showDelegate) {
      tabs = tabs.filter(tab => tab.id !== 'delegates');
    }

    if (!this.state.showFeedback) {
      bottomMenuTabs = bottomMenuTabs.filter(tab => tab.id !== 'feedback');
    }

    return (
      <Fragment>
        <aside className={styles.aside}>
          <div className={styles.sideBarWrapper}>
            <Link to={`${routes.dashboard.path}`} className='home-link'><img src={logo} className={styles.logo} /></Link>
            <ToolboxTabs index={getIndex(history, tabs)}
              theme={styles}
              onChange={this.navigate.bind(this, history, tabs)}
              disableAnimatedBottomBorder={true}
              className={`${styles.tabs} main-tabs`}>
              {tabs.map(({
                   label, image, id, enabledWhenNotLoggedIn,
                  }, index) =>
                <Tab
                  key={index}
                  label={<TabTemplate label={label} img={image} />}
                  className={styles.tab}
                  id={id}
                  disabled={!account.address && !enabledWhenNotLoggedIn}
                />)}
            </ToolboxTabs>
            <ToolboxTabs index={getIndex(history, bottomMenuTabs)}
              theme={styles}
              onChange={this.navigate.bind(this, history, bottomMenuTabs)}
              disableAnimatedBottomBorder={true}
              className={`${styles.tabs} ${styles.bottomTabs} main-tabs`}>
              {bottomMenuTabs.map(({
                   label, image, id, enabledWhenNotLoggedIn,
                  }, index) =>
                <Tab
                  key={index}
                  label={<TabTemplate label={label} img={image} isFontIcon />}
                  className={styles.bottomTab}
                  id={id}
                  disabled={!account.address && !enabledWhenNotLoggedIn}
                />)}
            </ToolboxTabs>
            <Drawer theme={styles}
              className='drawer'
              active={this.state.active}
              onOverlayClick={this.menuToggle.bind(this)}>
              <div>
                <header className={styles.header}>
                  <Link className={styles.homeLink} to={`${routes.dashboard.path}`}><img src={logo} className={styles.logo} /></Link>
                  <FontIcon value='close' className={styles.close} onClick={this.menuToggle.bind(this)} />
                </header>
                <ToolboxTabs index={getIndex(history, tabs)}
                  theme={styles}
                  onChange={this.navigate.bind(this, history, tabs)}
                  disableAnimatedBottomBorder={true}
                  className={`${styles.tabs} main-tabs`}>
                  {tabs.map(({
                       label, image, id, enabledWhenNotLoggedIn,
                      }, index) =>
                    <Tab
                      key={index}
                      label={<TabTemplate label={label} img={image} />}
                      id={id}
                      disabled={!account.address && !enabledWhenNotLoggedIn}
                    />)}
                </ToolboxTabs>

                <ToolboxTabs index={getIndex(history, bottomMenuTabs)}
                  theme={styles}
                  onChange={this.navigate.bind(this, history, bottomMenuTabs)}
                  disableAnimatedBottomBorder={true}
                  className={`${styles.tabs} ${styles.bottomTabs} main-tabs`}>
                  {bottomMenuTabs.map(({
                      label, image, id, enabledWhenNotLoggedIn,
                      }, index) =>
                    <Tab
                      key={index}
                      label={<TabTemplate label={label} img={image} isFontIcon />}
                      className={styles.bottomTab}
                      id={id}
                      disabled={!account.address && !enabledWhenNotLoggedIn}
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
