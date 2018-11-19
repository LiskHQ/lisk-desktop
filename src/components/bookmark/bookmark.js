import React from 'react';
import AccountVisual from '../accountVisual/index';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import keyCodes from './../../constants/keyCodes';
import regex from './../../utils/regex';

import styles from './bookmark.css';

class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selectedIdx: -1,
      resultsLength: 0,
      placeholder: '',
      title: '',
    };
  }

  componentDidMount() {
    const followedAccount = this.props.followedAccounts
      .find(account => account.address === this.props.address.value);
    const title = followedAccount ? followedAccount.title : '';

    if (title) {
      this.setState({ show: false, selectedIdx: -1, title });
    }
  }

  getFilteredFollowedAccounts() {
    const { followedAccounts, address } = this.props;

    return followedAccounts.filter(account => (
      (account.title && account.title.toLowerCase().includes(address.value.toLowerCase())) ||
      (account.address && account.address.toLowerCase().includes(address.value.toLowerCase()))
    ));
  }

  handleArrowDown() {
    let currentIdx = this.state.selectedIdx;
    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const searchListLength = filteredFollowedAccounts.length;
    if (searchListLength !== 0 && currentIdx !== searchListLength - 1) {
      currentIdx += 1;
      const placeholder = filteredFollowedAccounts[currentIdx].address;

      this.setState({ selectedIdx: currentIdx, placeholder });
    }
  }

  handleArrowUp() {
    let currentIdx = this.state.selectedIdx;
    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const searchListLength = filteredFollowedAccounts.length;

    if (searchListLength !== 0 && currentIdx !== -1 && currentIdx !== 0) {
      currentIdx -= 1;
      const placeholder = filteredFollowedAccounts[currentIdx].address;

      this.setState({ selectedIdx: currentIdx, placeholder });
    }
  }

  handleKey(event) {
    switch (event.keyCode) {
      case keyCodes.arrowDown:
        this.handleArrowDown();
        event.preventDefault();
        break;
      case keyCodes.arrowUp:
        this.handleArrowUp();
        event.preventDefault();
        break;
      case keyCodes.enter: // eslint-disable-line no-case-declarations
        const filteredFollowedAccounts = this.getFilteredFollowedAccounts(); // eslint-disable-line

        if (filteredFollowedAccounts[this.state.selectedIdx]) {
          const { title, address } = filteredFollowedAccounts[this.state.selectedIdx];

          this.props.handleChange(address);
          if (keyCodes.enter) {
            this.props.focusReference();
          }
          this.setState({ selectedIdx: 0, placeholder: '', title });
        }

        break;
      /* istanbul ignore next */
      default:
        break;
    }
    return false;
  }

  handleRemove() {
    this.setState({ showFollowedList: false });
  }

  render() {
    const {
      followedAccounts, handleChange, className, label, address,
    } = this.props;

    const filteredFollowedAccounts = this.getFilteredFollowedAccounts();
    const isValidAddress = address.value.match(regex.address);

    const isAddressFollowedAccounts = followedAccounts
      .find(account => account.address === address.value);

    const showBigVisualAccountStyles = isValidAddress &&
      !this.state.show &&
      !isAddressFollowedAccounts &&
      !address.error && address.value;

    const showSmallVisualAccountStyles = !(!isValidAddress && address.error && address.value);

    return (
      <div className={this.state.show ? styles.scale : ''}>
        <div className={this.state.show ? styles.bookmark : ''}>
          {isValidAddress && !this.state.show && !!isAddressFollowedAccounts ? <AccountVisual
            className={styles.smallAccountVisual}
            address={address.value}
            size={40}
          /> : null}

          {isValidAddress && !this.state.show && !isAddressFollowedAccounts ? <AccountVisual
            className={styles.bigAccountVisual}
            address={address.value}
            size={50}
          /> : null}
          <div className={styles.children}>{this.state.title}</div>
          <ToolBoxInput
            type='text'
            id='bookmark-input'
            className={`${className}
              ${this.state.title ? styles.inputChildren : ''}
              ${showSmallVisualAccountStyles ? `${styles.bookmarkInput} bookmarkInput` : ''}
              ${this.state.show ? styles.suggestionsActive : ''}
              ${showBigVisualAccountStyles ? `${styles.bigAccountVisualBookmarkInput} bigAccountVisualBookmarkInput` : ''}`}
            label={label}
            theme={styles}
            error={!this.state.show ? address.error : ''}
            ref={(input) => { this.bookmarkInput = input; }}
            autoComplete="off"
            placeholder={this.state.show ? this.state.placeholder : ''}
            value={address.value}
            onFocus={() => {
              this.setState({ show: true, title: '' });
              this.handleArrowDown();
            }}
            onBlur={() => {
              const followedAccount = this.props.followedAccounts
                .find(account => account.address === this.props.address.value);
              const title = followedAccount ? followedAccount.title : '';

              this.setState({ show: false, selectedIdx: -1, title });
            }}
            onKeyDown={this.handleKey.bind(this)}
            onChange={(val) => {
              this.setState({ selectedIdx: 0, placeholder: '', title: '' });
              handleChange(val);
            }}
            >
          </ToolBoxInput>
          { this.state.show && filteredFollowedAccounts.length !== 0 ?
            <ul className={`${filteredFollowedAccounts.length > 0 ? styles.resultList : ''}
              ${this.state.show ? styles.show : ''}
              bookmarkList`}>
              {
                filteredFollowedAccounts
                  .map((account, index) => (
                    <li
                      onMouseDown={() => {
                        this.setState({ selectedIdx: 0, placeholder: '', title: account.title });
                        handleChange(account.address);
                      }}
                      key={`followed-${index}`}
                      className={`${styles.followedRow} ${index === this.state.selectedIdx ? styles.selectedRow : ''}`}>
                      <AccountVisual
                        className={styles.accountVisual}
                        address={account.address}
                        size={40}
                      />
                      <div className={styles.text}>
                        <div className={styles.title}>{account.title}</div>
                        <div className={styles.address}>{account.address}</div>
                      </div>
                    </li>))
              }
            </ul> : null }
        </div>
      </div>
    );
  }
}

export default Bookmark;
