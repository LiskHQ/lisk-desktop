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

    return (
      <div className={styles.scale}>
        <div className={this.state.show ? styles.bookmark : ''}>
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
