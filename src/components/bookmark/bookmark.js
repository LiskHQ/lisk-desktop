import React from 'react';
import AccountVisual from '../accountVisual/index';
import Input from '../toolbox/inputs/input';
import styles from './bookmark.css';

class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  handleRemove() {
    this.setState({ showFollowedList: false });
  }

  render() {
    const {
      followedAccounts, handleChange, className, label, address,
    } = this.props;

    const filteredFollowedAccounts = followedAccounts
      .filter(account => account.title.toLowerCase()
        .includes(address.value.toLowerCase()));
    const isValidAccount = Number.isInteger(Number(address.value.substring(0, address.value.length - 1))) && address.value[address.value.length - 1] === 'L';

    const isAddressFollowedAccounts = followedAccounts
      .find(account => account.address === address.value);

    const showBigVisualAccountStyles = isValidAccount &&
      !this.state.show &&
      !isAddressFollowedAccounts &&
      !address.error && address.value;

    const showSmallVisualAccountStyles = !(!isValidAccount && address.error && address.value);

    return (
      <div className={styles.scale}>
        <div className={this.state.show ? styles.bookmark : ''}>
          {isValidAccount && !this.state.show && !!isAddressFollowedAccounts ? <AccountVisual
            className={styles.smallAccountVisual}
            address={address.value}
            size={25}
          /> : null}

          {isValidAccount && !this.state.show && !isAddressFollowedAccounts ? <AccountVisual
            className={styles.bigAccountVisual}
            address={address.value}
            size={50}
          /> : null}
          <Input
            className={`${className}
              ${showSmallVisualAccountStyles ? styles.bookmarkInput : ''}
              ${showBigVisualAccountStyles ? styles.bigAccountVisualBookmarkInput : ''}`}
            label={label}
            error={!this.state.show ? address.error : ''}
            value={address.value}
            onFocus={() => this.setState({ show: true })}
            onBlur={() => this.setState({ show: false })}
            onChange={(val) => { handleChange(val); }}
            >
          </Input>
          { this.state.show ?
            <ul className={`${filteredFollowedAccounts.length > 0 ? styles.resultList : ''} ${this.state.show ? styles.show : ''}`}>
              {
                filteredFollowedAccounts
                  .map((account, index) =>
                    <li
                      onMouseDown={() => {
                        handleChange(account.address);
                      }}
                      key={`followed-${index}`}
                      className={styles.followedRow}>
                      <AccountVisual
                        className={styles.accountVisual}
                        address={account.address}
                        size={35}
                      />
                      <div className={styles.text}>
                        <div className={styles.title}>{account.title}</div>
                        <div className={styles.address}>{account.address}</div>
                      </div>
                    </li>)
              }
            </ul> : null }
        </div>
      </div>
    );
  }
}

export default Bookmark;
