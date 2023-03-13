import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Icon from 'src/theme/Icon';
import DropdownContext from '../../context/dropdownContext';
import styles from './MenuSelect.css';

function MenuSelect({ value, children, onChange, className, select, disabled, popupClassName }) {
  const [selectedValue, setSelectedValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);

  const onKeyUp = useCallback(({ code }) => {
    if (code === 'Escape') setShowDropdown(false);
  }, []);

  const handleOnChange = useCallback((changeValue) => {
    setShowDropdown(false);
    setSelectedValue(changeValue);
    onChange?.(changeValue);
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => setSelectedValue(value), [value]);

  const selectedIndex = useMemo(
    () =>
      (children ?? []).reduce(
        (selected, { props }, index) =>
          select?.(selectedValue, props.value) || props.value === selectedValue ? index : selected,
        -1
      ),
    [selectedValue, children, value]
  );

  const handleOnClick = () => {
    if (!disabled) setShowDropdown(!showDropdown);
    return undefined;
  };

  return (
    <>
      {showDropdown && <div onClick={() => setShowDropdown(false)} className={styles.overlay} />}
      <div onClick={handleOnClick} className={`${styles.wrapper} ${className}`}>
        <div data-testid="selected-menu-item">{children[selectedIndex]}</div>
        {!disabled ? <Icon name="dropdownFieldIcon" /> : null}
      </div>
      <DropdownContext.Provider value={{ onChange: handleOnChange, selectedValue }}>
        {!disabled ? (
          <Dropdown
            showArrow={!disabled}
            className={`${styles.optionListWrapper} ${popupClassName}`}
            showDropdown={showDropdown}
          >
            {children}
          </Dropdown>
        ) : null}
      </DropdownContext.Provider>
    </>
  );
}

export default MenuSelect;
