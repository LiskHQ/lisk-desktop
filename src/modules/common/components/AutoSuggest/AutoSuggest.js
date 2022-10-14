import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { keyCodes } from 'src/utils/keyCodes';
import { Input } from 'src/theme';
import styles from './AutoSuggest.css';

// eslint-disable-next-line max-statements
const AutoSuggest = ({
  items,
  selectedItem,
  matchProps,
  onSelectItem,
  onChange,
  onChangeDelayed,
  placeholder,
  renderItem,
  renderIcon,
  className,
}) => {
  const [dropdownIndex, setDropdownIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  let loaderTimeout = null;
  const listContainerRef = useRef(null);

  const filterList = useMemo(() => {
    if (selectedItem.value === '') {
      return items;
    }

    return items.filter((item) =>
      matchProps.find((prop) => item[prop].toLowerCase().includes(selectedItem.value.toLowerCase()))
    );
  }, [selectedItem, items]);

  const resetListIndex = () => {
    setDropdownIndex(0);
  };

  const onItemSelect = (item) => {
    setIsLoading(false);
    resetListIndex();
    onSelectItem(item);
  };

  const onKeyPressDownOrUp = (action) => {
    const rowHeight = 44;
    const filteredItemsLength = filterList.length;

    setDropdownIndex((dropdownIndexVal) => {
      // istanbul ignore else
      if (action === 'down' && dropdownIndexVal < filteredItemsLength - 1) {
        if (dropdownIndexVal + 1 >= 4) {
          // eslint-disable-next-line operator-assignment
          listContainerRef.current.scrollTop = listContainerRef.current.scrollTop + rowHeight;
        }
        dropdownIndexVal += 1;
      }

      // istanbul ignore else
      if (action === 'up' && dropdownIndexVal > 0) {
        listContainerRef.current.scrollTop =
          listContainerRef.current.scrollTop > 0 &&
          (dropdownIndexVal - 1) * rowHeight < listContainerRef.current.scrollTop
            ? listContainerRef.current.scrollTop - rowHeight
            : listContainerRef.current.scrollTop;
        dropdownIndexVal -= 1;
      }
      return dropdownIndexVal;
    });
  };

  const handleUpdateIndex = (dropdownIndexVal) => {
    setDropdownIndex(dropdownIndexVal);
  };

  const onKeyPressEnter = () => {
    const item = filterList[dropdownIndex];
    onItemSelect(item);
  };

  const onHandleKeyPress = (e) => {
    // istanbul ignore else
    if (filterList.length) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
          onKeyPressDownOrUp('down');
          break;
        case keyCodes.arrowUp:
          onKeyPressDownOrUp('up');
          break;
        case keyCodes.enter:
          onKeyPressEnter();
          break;
        // istanbul ignore next
        default:
          break;
      }
    }
  };

  const onChangeEv = (e) => {
    clearTimeout(loaderTimeout);
    setIsLoading(true);
    loaderTimeout = setTimeout(() => {
      // istanbul ignore else
      if (filterList.length >= 0) {
        setIsLoading(false);
      }
      onChangeDelayed();
    }, 300);

    if (e?.target?.value === '') {
      resetListIndex();
    }
    onChange(e);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const isOnError = () => {
    if ((!items.length && selectedItem.error) || (!isFocused && selectedItem.error)) return true;
    return !!(items.length && !filterList.length && selectedItem.error);
  };

  return (
    <>
      <span className={`${styles.inputWrapper} ${className}`}>
        <Input
          autoComplete="off"
          className={`${styles.input} ${isOnError() ? 'error' : ''} ${className} bookmark`}
          name={className}
          value={selectedItem.selected ? selectedItem.title : selectedItem.value}
          placeholder={placeholder}
          onKeyDown={onHandleKeyPress}
          onChange={onChangeEv}
          feedback={selectedItem.feedback}
          isLoading={isLoading && selectedItem.value}
          status={isOnError() ? 'error' : 'ok'}
          icon={renderIcon(selectedItem)}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <ul className={`${styles.suggestionList} bookmark-list`} ref={listContainerRef}>
          {filterList.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => handleUpdateIndex(index)}
              onClick={() => onItemSelect(item)}
              onKeyPress={onHandleKeyPress}
              className={dropdownIndex === index ? styles.active : ''}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </span>
    </>
  );
};

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
  renderItem: (item) => item,
  renderIcon: () => null,
  onChangeDelayed: () => null,
  className: '',
  placeholder: '',
};

export default AutoSuggest;
