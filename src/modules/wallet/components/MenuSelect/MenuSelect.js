import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Dropdown from 'src/theme/Dropdown/dropdown';
import Feedback from 'src/theme/feedback/feedback';
import Icon from 'src/theme/Icon';
import Spinner from 'src/theme/Spinner';
import DropdownContext from '../../context/dropdownContext';
import styles from './MenuSelect.css';

function DropdownIconState({ isLoading, isValid }) {
  if (isLoading) return <Spinner className={styles.loading} />;
  if (isValid) return <Icon name="okIcon" className={styles.status} />;
  return <Icon name="dropdownFieldIcon" />;
}

function MenuSelect({
  value,
  children,
  onChange,
  className,
  select,
  disabled,
  popupClassName,
  isLoading,
  isValid,
  size,
  feedback,
  status,
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
    if (!disabled && !isLoading) setShowDropdown(!showDropdown);
  };

  return (
    <>
      {showDropdown && (
        <div
          data-testid="overlay"
          onClick={() => setShowDropdown(false)}
          className={styles.overlay}
        />
      )}
      <div onClick={handleOnClick} className={`${styles.wrapper} ${className}`}>
        <div data-testid="selected-menu-item">{children[selectedIndex]}</div>
        {!disabled && <DropdownIconState isLoading={isLoading} isValid={isValid} />}
      </div>
      <DropdownContext.Provider value={{ onChange: handleOnChange, selectedValue }}>
        {!disabled && (
          <Dropdown
            showArrow={!disabled}
            className={`${styles.optionListWrapper} ${popupClassName}`}
            showDropdown={showDropdown}
          >
            {children}
          </Dropdown>
        )}
      </DropdownContext.Provider>
      {disabled && <Feedback message={feedback} size={size} status={status} />}
    </>
  );
}

MenuSelect.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['ok', 'error', 'pending', undefined]),
  feedback: PropTypes.string,
};

MenuSelect.defaultProps = {
  size: 'l',
  status: undefined,
  feedback: '',
};

export default MenuSelect;
