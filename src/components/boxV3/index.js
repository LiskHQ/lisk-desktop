// istanbul ignore file
import React, { Component } from 'react';
import styles from './box.css';

class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };

    this.onActiveTabChange = this.onActiveTabChange.bind(this);
  }

  onActiveTabChange(tab, tabIndex) {
    this.setState({ activeTab: tabIndex });
    this.props.onTabClick(tab);
  }

  render() {
    const {
      children,
      className = '',
      tabs = null,
      title,
      t,
    } = this.props;
    const { activeTab } = this.state;

    return (
      <div className={`${styles.wrapper} ${className} box-container`}>
        <header className={`${styles.header} box-header`}>
          <h1>{t(title)}</h1>
          {
            tabs
            ? <div className={`${styles.tabs} tabs-container`}>
              {
                tabs.map((tab, index) =>
                  <span
                    key={index}
                    className={`${styles.tab} ${activeTab === index ? styles.activeTab : ''} `}
                    onClick={() => this.onActiveTabChange(tab, index)}>
                    {t(tab)}
                  </span>)
              }
            </div>
            : null
          }
        </header>
        {children}
      </div>
    );
  }
}

export default Box;
