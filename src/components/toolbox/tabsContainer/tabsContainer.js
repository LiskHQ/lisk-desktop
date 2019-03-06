import React from 'react';
import PropTypes from 'prop-types';
import styles from './tabsContainer.css';

class TabsContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTab: '',
    };
  }

  setTab(activeTab) {
    this.setState({ activeTab });
  }

  // eslint-disable-next-line class-methods-use-this
  filterChildren(children) {
    return (Array.isArray(children) && children.filter(c => c)) || [children];
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextTabs = this.filterChildren(nextProps.children);
    const currentTabs = this.filterChildren(this.props.children);
    if (nextTabs.length !== currentTabs.length) {
      const activeTab = nextTabs.length > 1 && (this.props.activeTab || nextTabs[0].props.tabName);
      this.setState({ activeTab });
      return false;
    }
    return nextState.active !== this.state.activeTab;
  }

  componentDidMount() {
    const children = this.filterChildren(this.props.children);

    this.setState({
      activeTab: (children.length > 1
        && (this.props.activeTab || children[0].props.tabName))
        || '',
    });
  }

  render() {
    const children = this.filterChildren(this.props.children);
    const { activeTab } = this.state;

    return (activeTab !== '' ? (
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
    ) : children) || null;
  }
}

TabsContainer.propTypes = {
  activeTab: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default TabsContainer;
