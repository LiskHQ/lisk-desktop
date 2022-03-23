import PropTypes from 'prop-types';
import React from 'react';
import { keyCodes } from '@common/configuration';
import { Input } from '../inputs';
import styles from './autoSuggest.css';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownIndex: 0,
      isLoading: false,
      isFocused: true,
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
    const filteredItemsLength = this.getFilterList().length;

    this.setState(({ dropdownIndex }) => {
      // istanbul ignore else
      if (action === 'down' && dropdownIndex < filteredItemsLength - 1) {
        if (dropdownIndex + 1 >= 4) {
          // eslint-disable-next-line operator-assignment
          this.listContainerRef.scrollTop = this.listContainerRef.scrollTop + rowHeight;
        }
        dropdownIndex += 1;
      }

      // istanbul ignore else
      if (action === 'up' && dropdownIndex > 0) {
        this.listContainerRef.scrollTop = this.listContainerRef.scrollTop > 0
        && (dropdownIndex - 1) * rowHeight < this.listContainerRef.scrollTop
          ? this.listContainerRef.scrollTop - rowHeight
          : this.listContainerRef.scrollTop;
        dropdownIndex -= 1;
      }
      return { dropdownIndex };
    });
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

    if (e?.target?.value === '') this.resetListIndex();
    this.props.onChange(e);
  }

  onBlur = () => {
    this.setState({ isFocused: false });
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  }

  isOnError = () => {
    const { isFocused } = this.state;
    const { selectedItem, items } = this.props;
    const bookmarksList = this.getFilterList();

    if ((!items.length && selectedItem.error) || (!isFocused && selectedItem.error)) return true;
    if (items.length && !bookmarksList.length && selectedItem.error) {
      return true;
    }
    return false;
  }

  render() {
    const {
      selectedItem,
      placeholder,
      renderItem,
      renderIcon,
      className,
    } = this.props;
    const { dropdownIndex, isLoading } = this.state;

    return (
      <>
        <span className={`${styles.inputWrapper} ${className}`}>
          <Input
            autoComplete="off"
            className={`${styles.input} ${this.isOnError() ? 'error' : ''} ${className} bookmark`}
            name={className}
            value={selectedItem.selected ? selectedItem.title : selectedItem.value}
            placeholder={placeholder}
            onKeyDown={this.onHandleKeyPress}
            onChange={this.onChange}
            feedback={selectedItem.feedback}
            isLoading={isLoading && selectedItem.value}
            status={this.isOnError() ? 'error' : 'ok'}
            icon={renderIcon(selectedItem)}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
          <ul className={`${styles.suggestionList} bookmark-list`} ref={(node) => { this.listContainerRef = node; }}>
            { this.getFilterList()
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
              )) }
          </ul>
        </span>
      </>
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
