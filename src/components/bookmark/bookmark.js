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

    return (
      <div className={styles.bookmark}>
        <Input
          className={`${className} ${styles.bookmarkInput}`}
          label={label}
          error={''}
          value={address.value}
          onFocus={() => this.setState({ show: true })}
          onBlur={() => this.setState({ show: false })}
          onChange={(val) => { handleChange(val); }}
          >
        </Input>
        { this.state.show ?
          <ul className={`${styles.resultList} ${this.state.show ? styles.show : ''}`}>
            {
              followedAccounts
                .filter(account => account.title.toLowerCase()
                  .includes(address.value.toLowerCase()))
                .map((account, index) =>
                  <li
                    onClick={() => { handleChange(account.address); }}
                    key={`followed-${index}`}
                    className={styles.followedRow}>
                    <AccountVisual
                      className={styles.accountVisual}
                      address={account.address}
                      size={43}
                    />
                    <div>
                      <div>{account.title}</div>
                      <div>{account.address}</div>
                    </div>
                  </li>)
            }
          </ul> : null }
      </div>
    );
  }
}

export default Bookmark;
