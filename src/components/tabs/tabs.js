import React from 'react';
import { Tab, Tabs as ToolboxTabs, Drawer, Switch } from 'react-toolbox';
import ReactSwipe from 'react-swipe';
import styles from './tabs.css';
import logo from '../../assets/images/Lisk-Logo.svg';
import * as menuLogos from '../../assets/images/sidebar-icons/*.svg'; //eslint-disable-line
import { FontIcon } from '../fontIcon';

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


class Tabs extends React.Component {
  constructor() {
    super();
    this.state = {
      active: false,
      activeSlide: 0,
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

  changeSlide(i) {
    this.setState({
      activeSlide: i,
    });
  }

  render() {
    const { history, isDelegate, t } = this.props;
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
        <div onClick={this.menuToggle.bind(this)} id='moreMenu' className={styles.setting}>
          <FontIcon value='more' className={styles.readMoreIcon} />
          <span className={styles.readMoreText}>{t('more')}</span>
        </div>
        <Drawer theme={styles}
          className='drawer'
          active={this.state.active}
          onOverlayClick={this.menuToggle.bind(this)}>
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
          <ReactSwipe
            className={styles.carousel}
            ref={(reactSwipe) => { this.reactSwipe = reactSwipe; }}
            swipeOptions={{
              stopPropagation: true,
              continuous: false,
              transitionEnd: index => this.changeSlide(index),
            }}>
            <div>
              <Switch
                label='Nothing, thanks'
                onChange={() => console.log('checked')}
              />
            </div>
            <div>PANE 2</div>
            <div>PANE 3</div>
          </ReactSwipe>
          <ul className={ styles.carouselNav }>
            {[...Array(3)].map((x, i) =>
              <li
                key={i}
                className={(i === this.state.activeSlide) ? styles.activeSlide : ''}
                onClick={() => this.reactSwipe.slide(i)}>
              </li>,
            )}
          </ul>
          {this.state.activeSlide}
        </Drawer>
      </div>
    );
  }
}

export default Tabs;
