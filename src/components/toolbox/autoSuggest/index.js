import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input } from '../inputs';
import Feedback from '../feedback/feedback';
import Icon from '../icon';
import Spinner from '../../spinner/spinner';
import keyCodes from '../../../constants/keyCodes';
import styles from './autoSuggest.css';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownIndex: 0,
      isLoading: false,
    };

    this.loaderTimeout = null;
    this.listContainerRef = null;
    this.input = null;

    this.bindAll();
  }

  bindAll() {
    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.onKeyPressDownOrUp = this.onKeyPressDownOrUp.bind(this);
    this.onKeyPressEnter = this.onKeyPressEnter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.resetListIndex = this.resetListIndex.bind(this);
    this.handleUpdateIndex = this.handleUpdateIndex.bind(this);
  }

  getFilterList() {
    const { items, selectedItem, matchProps } = this.props;

    if (selectedItem.value === '') return items;

    return items.filter(item => (
      matchProps.find(prop => (
        item[prop].toLowerCase().includes(selectedItem.value.toLowerCase())
      ))
    ));
  }

  resetListIndex() {
    this.setState({ dropdownIndex: 0 });
  }

  onSelectItem(item) {
    this.setState({ isLoading: false });
    this.resetListIndex();
    this.props.onSelectItem(item);
  }

  onKeyPressDownOrUp(action) {
    const rowHeight = 44;
    const { dropdownIndex } = this.state;
    const filteredItemsLength = this.getFilterList().length;

    // istanbul ignore else
    if (action === 'down' && dropdownIndex < filteredItemsLength - 1) {
      if (dropdownIndex + 1 >= 4) {
        this.listContainerRef.scrollTop = this.listContainerRef.scrollTop + rowHeight;
      }
      this.setState({ dropdownIndex: dropdownIndex + 1 });
    }

    // istanbul ignore else
    if (action === 'up' && dropdownIndex > 0) {
      this.listContainerRef.scrollTop = this.listContainerRef.scrollTop > 0
        && (dropdownIndex - 1) * rowHeight < this.listContainerRef.scrollTop
        ? this.listContainerRef.scrollTop - rowHeight
        : this.listContainerRef.scrollTop;
      this.setState({ dropdownIndex: dropdownIndex - 1 });
    }
  }

  handleUpdateIndex(dropdownIndex) {
    this.setState({ dropdownIndex });
  }

  onKeyPressEnter() {
    const { dropdownIndex } = this.state;
    const item = this.getFilterList()[dropdownIndex];
    this.onSelectItem(item);
  }

  onHandleKeyPress(e) {
    // istanbul ignore else
    if (this.getFilterList().length) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
          this.onKeyPressDownOrUp('down');
          break;
        case keyCodes.arrowUp:
          this.onKeyPressDownOrUp('up');
          break;
        case keyCodes.enter:
          this.onKeyPressEnter();
          break;
        // istanbul ignore next
        default:
          break;
      }
    }
  }

  onChange(e) {
    clearTimeout(this.loaderTimeout);
    this.setState({ isLoading: true });
    this.loaderTimeout = setTimeout(() => {
      // istanbul ignore else
      if (this.getFilterList().length >= 0) this.setState({ isLoading: false });
      this.props.onChangeDelayed();
    }, 300);

    if (e && e.target && e.target.value === '') this.resetListIndex();
    this.props.onChange(e);
  }

  render() {
    const {
      selectedItem,
      placeholder,
      renderItem,
      renderIcon,
      className,
    } = this.props;
    const { dropdownIndex } = this.state;

    return (
      <Fragment>
        <span className={`${styles.inputWrapper} ${className}`}>
          <span className={styles.icon}>
            {renderIcon(selectedItem)}
          </span>
          <Input
            autoComplete="off"
            className={`${styles.input} ${selectedItem.error ? 'error' : ''} ${className} bookmark`}
            name={className}
            value={selectedItem.selected ? selectedItem.title : selectedItem.value}
            placeholder={placeholder}
            onKeyDown={this.onHandleKeyPress}
            onChange={this.onChange}
          />
          <Spinner className={`${styles.spinner} ${this.state.isLoading && selectedItem.value ? styles.show : styles.hide}`} />
          <Icon
            className={`${styles.status} ${!this.state.isLoading && selectedItem.value ? styles.show : styles.hide}`}
            name={selectedItem.error ? 'alertIcon' : 'okIcon'}
          />
          <div className={`${styles.listContainer}`}>
            <div ref={(node) => { this.listContainerRef = node; }}>
              <ul className={`${styles.itemList} bookmark-list`}>
                {
                this.getFilterList()
                  .map((item, index) => (
                    <li
                      key={index}
                      onMouseEnter={() => this.handleUpdateIndex(index)}
                      onClick={() => this.onSelectItem(item)}
                      onKeyPress={this.onHandleKeyPress}
                      className={`${dropdownIndex === index ? styles.active : ''}`}
                    >
                      {renderItem(item)}
                    </li>
                  ))
              }
              </ul>
            </div>
          </div>
        </span>

        <Feedback
          show={selectedItem.error || false}
          status="error"
          className={styles.feedbackMessage}
          showIcon={false}
        >
          {selectedItem.feedback}
        </Feedback>
      </Fragment>
    );
  }
}

AutoSuggest.propTypes = {
  renderItem: PropTypes.func,
  renderIcon: PropTypes.func,
  onChangeDelayed: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  matchProps: PropTypes.arrayOf(PropTypes.string).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedItem: PropTypes.shape().isRequired,
};

AutoSuggest.defaultProps = {
  renderItem: item => item,
  renderIcon: () => null,
  onChangeDelayed: () => null,
  className: '',
  placeholder: '',
};

export default AutoSuggest;
