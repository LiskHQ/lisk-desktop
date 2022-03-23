import React from 'react';
import { SecondaryButton } from '../../../buttons';
import Dropdown from '../../../dropdown/dropdown';
import OutsideClickHandler from '../outsideClickHandler';
import styles from './dropdownButton.css';

class DropdownButton extends React.Component {
  constructor() {
    super();

    this.state = {
      shownDropdown: false,
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  toggleDropdown(_, showDropdown) {
    this.setState(prevState => ({
      shownDropdown: showDropdown || !prevState.shownDropdown,
    }));
  }

  render() {
    const { shownDropdown } = this.state;
    const {
      ButtonComponent, buttonLabel, buttonType, children, align, size,
      wrapperClassName, buttonClassName, className,
    } = this.props;
    return (
      <>
        <OutsideClickHandler
          className={`${styles.wrapper} ${wrapperClassName}`}
          disabled={!shownDropdown}
          onOutsideClick={this.toggleDropdown}
        >
          <ButtonComponent
            onClick={this.toggleDropdown}
            className={buttonClassName}
            size={size}
            type={buttonType}
          >
            { buttonLabel }
          </ButtonComponent>
          <Dropdown
            showArrow={false}
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
}

DropdownButton.defaultProps = {
  className: '',
  buttonLabel: '',
  buttonType: 'submit',
  buttonClassName: '',
  ButtonComponent: SecondaryButton,
  align: 'left',
  size: 'l',
};

export default DropdownButton;
