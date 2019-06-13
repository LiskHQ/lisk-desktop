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
    const { button, className, children } = this.props;
    return (
      <React.Fragment>
        <OutsideClickHandler
          className={styles.wrapper}
          disabled={shownDropdown}
          onOutsideClick={this.toggleDropdown}
        >
          <SecondaryButtonV2 onClick={this.toggleDropdown}>
            { button.label }
          </SecondaryButtonV2>
          <DropdownV2
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
  button: {
    label: '',
  },
};

export default DropdownButton;
