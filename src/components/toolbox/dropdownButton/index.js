import React from 'react';
import { SecondaryButton } from '../buttons/button';
import Dropdown from '../dropdown/dropdown';
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

  toggleDropdown() {
    this.setState(prevState => ({
      shownDropdown: !prevState.shownDropdown,
    }));
  }

  render() {
    const { shownDropdown } = this.state;
    const {
      ButtonComponent, buttonLabel, buttonClassName, className, children, align, size,
    } = this.props;
    return (
      <React.Fragment>
        <OutsideClickHandler
          className={styles.wrapper}
          disabled={!shownDropdown}
          onOutsideClick={this.toggleDropdown}
        >
          <ButtonComponent onClick={this.toggleDropdown} className={buttonClassName} size={size}>
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
      </React.Fragment>
    );
  }
}

DropdownButton.defaultProps = {
  className: '',
  buttonLabel: '',
  buttonClassName: '',
  ButtonComponent: SecondaryButton,
  align: 'left',
  size: 'l',
};

export default DropdownButton;
