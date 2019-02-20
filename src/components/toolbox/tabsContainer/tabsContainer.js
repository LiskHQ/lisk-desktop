import React from 'react';
import styles from './tabsContainer.css';

class TabsContainer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      activeTab: (Array.isArray(props.children)
        && (props.activeTab || props.children[0].props.tabName))
        || '',
    };
  }

  setTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    const { children } = this.props;
    const { activeTab } = this.state;

    return activeTab !== '' ? (
      <div className={styles.wrapper}>
        <ul className={styles.tabs}>
          {children.filter(tab => !!tab.props.tabName).map((tab, key) => (
            <li className={`${tab.props.tabName === activeTab ? styles.active : ''}`}
              onClick={() => this.setTab(tab.props.tabName)}
              key={key}
            >{tab.props.tabName}</li>
          ))}
        </ul>
        <div className={styles.contentHolder}>
          {children.filter(tab => !!tab.props.tabName).map((tab, key) => (
            <div
              className={`${tab.props.tabName === activeTab ? styles.active : ''}`}
              key={key}>{ tab }</div>
          ))}
        </div>
      </div>
    ) : children;
  }
}

export default TabsContainer;
