import React from 'react';

import { FontIcon } from 'react-toolbox/lib/font_icon';

import styles from './menuBar.css';

class MenuBar extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
  }
  toggleMenu() {
    this.props.menu();
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }
  render() {
    const { t } = this.props;
    const menuClass = this.state.showMenu ? styles.openMenu : '';
    return (
      <section className={`${styles.menuBar}  ${menuClass}`}>
        {!this.state.showMenu ?
          <span className={`${styles.menuItem} ${styles.menuButton}`}
            onClick={this.toggleMenu.bind(this)}>
            {t('Menu')}<FontIcon value='menu' />
          </span>
          : <span className={`${styles.menuItem} ${styles.menuButton}`}
            onClick={this.toggleMenu.bind(this)}>
            {t('Close')} <FontIcon value='close' />
          </span>
        }
      </section>
    );
  }
}

export default MenuBar;

