import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Icon from 'src/theme/Icon';
import DropdownContext from '../../context/dropdownContext';
import styles from './MenuSelect.css';

function MenuSelect({
  value, children, onChange, className,
}) {
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

  const selectedIndex = useMemo(() => children.reduce(
    (selected, { props }, index) => (props.value === selectedValue ? index : selected), -1,
  ), [selectedValue, value]);

  return (
    <>
      {showDropdown && <div onClick={() => setShowDropdown(false)} className={styles.overlay} />}
      <div onClick={() => setShowDropdown(!showDropdown)} className={`${styles.wrapper} ${className}`}>
        <div data-testid="selected-menu-item">
          {children[selectedIndex]}
        </div>
        <Icon name="dropdownFieldIcon" />
      </div>
      <DropdownContext.Provider value={{ onChange: handleOnChange, selectedValue }}>
        <Dropdown
          showArrow
          className={styles.optionListWrapper}
          showDropdown={showDropdown}
        >
          {children}
        </Dropdown>
      </DropdownContext.Provider>
    </>
  );
}

export default MenuSelect;
