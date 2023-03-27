import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { selectSearchParamValue } from 'src/utils/searchParams';
import Switcher from '../switcher';
import styles from './tabsContainer.css';

class TabsContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTab: '',
    };

    this.filterChildren = this.filterChildren.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  filterChildren(children) {
    const _children = (Array.isArray(children) && children.filter((c) => c)) || [children];
    return _children.filter((tab) => !!tab.props.id);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextTab = selectSearchParamValue(nextProps.history.location.search, 'tab');
    const nextTabs = this.filterChildren(nextProps.children);
    const currentTabs = this.filterChildren(this.props.children);

    /* istanbul ignore next */
    if (nextTabs.length !== currentTabs.length) {
      const activeTab =
        (nextTabs.length > 1 && (this.props.activeTab || nextTabs[0].props.id)) || '';
      this.setState({ activeTab });
      return false;
    }

    if (nextTab && nextTab !== this.state.activeTab) {
      this.setState({ activeTab: nextTab });
    }

    return nextState.active !== this.state.activeTab;
  }

  componentDidMount() {
    const children = this.filterChildren(this.props.children);
    const tab = selectSearchParamValue(this.props.history.location.search, 'tab');

    this.setState({
      activeTab:
        (React.Children.count(children) > 1 &&
          (tab || this.props.activeTab || children[0].props.id)) ||
        '',
    });
  }

  render() {
    const children = this.filterChildren(this.props.children);
    const { activeTab } = this.state;

    return React.Children.count(children) > 1 ? (
      <div className={styles.wrapper} name={this.props.name}>
        <Switcher
          options={React.Children.map(children.filter(React.isValidElement), (tab) => ({
            name: tab.props.name,
            value: tab.props.name,
            id: tab.props.id,
          }))}
          active={activeTab}
        />
        <div className={styles.contentHolder}>
          {React.Children.map(
            children,
            (tab) =>
              React.isValidElement(tab) && (
                <div className={`${tab.props.id === activeTab ? styles.active : ''}`}>{tab}</div>
              )
          )}
        </div>
      </div>
    ) : (
      children
    );
  }
}

TabsContainer.propTypes = {
  activeTab: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
    .isRequired,
};

export default withRouter(TabsContainer);
