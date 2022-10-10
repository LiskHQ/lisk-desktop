import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useOutsideClick } from 'src/modules/common/hooks/useOutsideClick';
import { flattenArray } from 'src/utils/helpers';
import styles from './dropdown.css';
import Separator from './separator';

const Dropdown = ({
  showDropdown, className, title, showArrow, active, children, align, closeDropdown = () => { }, item
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef()
  const isSelectionList = children && Array.isArray(children);

  const handleClose = () => {
    closeDropdown();
    setIsOpen(false);
  }

  useOutsideClick(dropdownRef, handleClose)

  const DropdownItem = item

  return (
    <div>
      {DropdownItem && <div onClick={() => setIsOpen(true)} ><DropdownItem /></div>}
      <div
        ref={dropdownRef}
        className={[
          styles.dropdown,
          showDropdown || isOpen ? styles.show : '',
          className,
          styles[align],
        ].join(' ')}
        data-testid="dropdown-popup"
      >
        {
          showArrow && (
            <span className={`${styles.dropdownArrow} dropdown-arrow`}>
              <svg stroke="inherit" fill="currentColor" viewBox="0 0 36 9">
                <path d="M2 9c9-2 11-7.5 16-7.5S27 7 34 9" />
              </svg>
            </span>
          )
        }
        <div className={`${styles.dropdownContent} dropdown-content ${isSelectionList ? 'options' : ''}`}>
          {title && <div className={styles.title}>{title}</div>}
          {
            isSelectionList ? flattenArray(children).map((child, key) => (
              child.type === Separator
                ? child
                : React.cloneElement(child, { className: ` ${styles.option} ${active === key ? styles.active : ''} ${child.props.className || ''}`, key })
            )) : children
          }
        </div>
      </div>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.arrayOf(PropTypes.arrayOf),
  ]).isRequired,
  showDropdown: PropTypes.bool,
  className: PropTypes.string,
  showArrow: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'center', 'right']),
};

Dropdown.defaultProps = {
  showDropdown: false,
  className: '',
  showArrow: true,
  active: -1,
  align: 'right',
};

Dropdown.Separator = Separator;

export default Dropdown;
