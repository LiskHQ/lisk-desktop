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

  componentDidUpdate(prevProps) {
    const { shouldCloseDropdown } = this.props;
    if (shouldCloseDropdown
        && prevProps.shouldCloseDropdown !== shouldCloseDropdown
        && shouldCloseDropdown === true) {
      this.toggleDropdown();
    }
  }

  toggleDropdown() {
    const { getDropdownStatus } = this.props;
    this.setState(prevState => ({
      shownDropdown: !prevState.shownDropdown,
    }));
    if (getDropdownStatus) getDropdownStatus(!this.state.shownDropdown);
  }

  render() {
    const { shownDropdown } = this.state;
    const {
      ButtonComponent, buttonLabel, buttonClassName, className, children,
    } = this.props;
    return (
      <React.Fragment>
        <OutsideClickHandler
          className={styles.wrapper}
          disabled={!shownDropdown}
          onOutsideClick={this.toggleDropdown}
        >
          <ButtonComponent onClick={this.toggleDropdown} className={buttonClassName}>
            { buttonLabel }
          </ButtonComponent>
          <Dropdown
            showArrow={false}
            showDropdown={shownDropdown}
            className={`${styles.dropdown} ${className}`}
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
  shouldCloseDropdown: null,
  getDropdownStatus: null,
};

export default DropdownButton;
