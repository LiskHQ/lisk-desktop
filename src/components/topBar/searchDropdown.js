import React from 'react';
import { Link } from 'react-router-dom';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import LiskAmount from '../liskAmount';
import DropdownV2 from '../toolbox/dropdownV2/dropdownV2';
import SearchBar from '../searchBar';
import { dropdownLinks } from './constants';
import accountIcon from '../../assets/images/icons-v2/icon-account.svg';
import searchIcon from '../../assets/images/icons-v2/icon-search.svg';
import styles from './userAccount.css';
import topBarStyles from './topBar.css';

class SearchDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownEnable: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setDropdownRef = this.setDropdownRef.bind(this);
  }
  
  setDropdownRef(node) {
    this.dropdownRef = node;
  }

  handleClick() {
    if (!this.state.isDropdownEnable) {
      document.addEventListener('click', this.handleClickOutside, false);
    } else {
      document.removeEventListener('click', this.handleClickOutside, false);
    }

    this.setState(prevState => ({ isDropdownEnable: !prevState.isDropdownEnable }));
  }

  // istanbul ignore next
  handleClickOutside(e) {
    if (this.dropdownRef && this.dropdownRef.contains(e.target)) return;
    this.handleClick();
  }

  render() {
    const dropdownOptions = dropdownLinks(this.props.t);

    return (
      <div
        className={`${styles.wrapper} user-account ${topBarStyles.navItem}`}
        onClick={() => this.handleClick()}>
        <div
          className={`${styles.avatar} user-avatar`}
        >
          <span
            className={styles.onAvatar}
            ref={node => this.setDropdownRef(node)}
          >
            <img src={searchIcon}/>
          </span>

          <DropdownV2
            showArrow={true}
            className={styles.dropdown} showDropdown={this.state.isDropdownEnable}>
            <SearchBar />
          </DropdownV2>
        </div>
      </div>
    );
  }
};

export default SearchDropdown;
