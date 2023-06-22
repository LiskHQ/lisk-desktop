import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { SecondaryButton } from 'src/theme/buttons';
import Dropdown from 'src/theme/Dropdown/dropdown';
import OutsideClickHandler from 'src/theme/Select/OutsideClickHandler';
import styles from './dropdownButton.css';

const DropdownButton = forwardRef(
  (
    {
      onDropdownOpen,
      isDropdownShown,
      trackDropdownState,
      ButtonComponent,
      buttonLabel,
      buttonType,
      children,
      align,
      size,
      wrapperClassName,
      buttonClassName,
      className,
      showArrow = false,
    },
    ref
  ) => {
    const [shownDropdown, setShownDropdown] = useState(isDropdownShown);

    const toggleDropdown = (_, showDropdownValue) => {
      if (showDropdownValue || !shownDropdown) onDropdownOpen?.();
      setShownDropdown(showDropdownValue || !shownDropdown);
    };

    useEffect(() => {
      trackDropdownState?.(shownDropdown);
    }, [shownDropdown]);

    useEffect(() => {
      setShownDropdown(isDropdownShown);
    }, [isDropdownShown]);

    useImperativeHandle(ref, () => ({ toggleDropdown }), [shownDropdown]);

    return (
      <>
        <OutsideClickHandler
          className={`${styles.wrapper} ${wrapperClassName}`}
          disabled={!shownDropdown}
          onOutsideClick={toggleDropdown}
        >
          <ButtonComponent
            onClick={toggleDropdown}
            className={buttonClassName}
            size={size}
            type={buttonType}
          >
            {buttonLabel}
          </ButtonComponent>
          <Dropdown
            showArrow={showArrow}
            showDropdown={shownDropdown}
            className={`${styles.dropdown} ${className}`}
            align={align}
          >
            {children}
          </Dropdown>
        </OutsideClickHandler>
      </>
    );
  }
);

DropdownButton.defaultProps = {
  className: '',
  buttonLabel: '',
  buttonType: 'submit',
  buttonClassName: '',
  ButtonComponent: SecondaryButton,
  align: 'left',
  size: 'l',
  trackDropdownState: () => {},
};

export default DropdownButton;
