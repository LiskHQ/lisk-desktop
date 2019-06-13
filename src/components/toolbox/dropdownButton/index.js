import React from 'react';

import { SecondaryButtonV2 } from '../buttons/button';
import DropdownV2 from '../dropdownV2/dropdownV2';
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
      ButtonComponent, buttonLabel, className, children,
    } = this.props;
    return (
      <React.Fragment>
        <OutsideClickHandler
          className={styles.wrapper}
          disabled={!shownDropdown}
          onOutsideClick={this.toggleDropdown}
        >
          <ButtonComponent onClick={this.toggleDropdown}>
            { buttonLabel }
          </ButtonComponent>
          <DropdownV2
            showArrow={false}
            showDropdown={shownDropdown}
            className={`${className} ${styles.dropdown}`}
          >
            {children}
          </DropdownV2>
        </OutsideClickHandler>
      </React.Fragment>
    );
  }
}

DropdownButton.defaultProps = {
  className: '',
  buttonLabel: '',
  ButtonComponent: SecondaryButtonV2,
};

export default DropdownButton;
