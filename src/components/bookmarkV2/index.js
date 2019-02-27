import React, { Fragment } from 'react';
import AccountVisual from '../accountVisual/index';
import { InputV2 } from '../toolbox/inputsV2';
import keyCodes from './../../constants/keyCodes';
import svg from '../../utils/svgIcons';
import styles from './bookmark.css';

// eslint-disable-next-line complexity
class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownIndex: -1,
    };

    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.onKeyPressDown = this.onKeyPressDown.bind(this);
    this.onKeyPressUp = this.onKeyPressUp.bind(this);
    this.onKeyPressEnter = this.onKeyPressEnter.bind(this);
  }

  componentDidMount() {
    if (this.props.followedAccounts.length) {
      this.setState({ dropdownIndex: 0 });
    }
  }

  getFilterList() {
    const { followedAccounts, recipient } = this.props;

    return followedAccounts
      .filter(account =>
        account.title.toLowerCase().includes(recipient.value.toLowerCase()) ||
        account.address.toLowerCase().includes(recipient.value.toLowerCase()));
  }

  onKeyPressDown() {
    const accountsLength = this.getFilterList().length();
    const { dropdownIndex } = this.state;

    if (dropdownIndex < accountsLength) {
      this.setState({ dropdownIndex: this.state.dropdownIndex + 1 });
    }
  }

  onKeyPressUp() {
    const { dropdownIndex } = this.state;

    if (dropdownIndex > 0) {
      this.setState({ dropdownIndex: this.state.dropdownIndex - 1 });
    }
  }

  onKeyPressEnter() {
    const { dropdownIndex } = this.state;
    const account = this.getFilterList()[dropdownIndex];
    this.props.selectedAccount(account);
  }

  onHandleKeyPress(e) {
    e.preventDefault();
    if (this.props.showSuggestions) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
          this.onKeyPressDown();
          break;

        case keyCodes.arrowUp:
          this.onKeyPressUp();
          break;

        case keyCodes.enter:
          this.onKeyPressEnter();
          break;

        default:
          break;
      }
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      onChange,
      onSelectedAccount,
      placeholder,
      recipient,
      showSuggestions,
      t,
    } = this.props;
    const { dropdownIndex } = this.state;

    const showAccountVisual = recipient.address.length && !recipient.error;
    const selectedAccount = recipient.selected ? recipient.title : recipient.value;

    return (
      <Fragment>
        <span className={`${styles.recipientField} recipient`}>
          {
            showAccountVisual
              ? <AccountVisual
                  className={styles.accountVisual}
                  address={recipient.address}
                  size={25}
                />
              : null
          }
          <InputV2
            autoComplete={'off'}
            onChange={onChange}
            name={'recipient'}
            value={selectedAccount}
            placeholder={t(placeholder)}
            // onKeyDown={this.onHandleKeyPress}
            className={`${styles.input} ${recipient.error ? 'error' : ''} ${showAccountVisual ? styles.moveTextToRight : null} recipient bookmark`}
          />
          {
            recipient.value || recipient.error
            ? <img
                className={styles.status}
                src={ recipient.error ? svg.alert_icon : svg.ok_icon}
              />
            : null
          }
          {
            showSuggestions
            ? <div className={styles.bookmarkContainer}>
                <ul className={styles.bookmarkList}>
                  {
                    this.getFilterList()
                    .map((account, index) =>
                      <li key={index} onClick={() => onSelectedAccount(account)} className={dropdownIndex === index ? styles.active : ''}>
                        <AccountVisual address={account.address} size={25} />
                        <span>{account.title}</span>
                        <span>{account.address}</span>
                      </li>)
                  }
                  </ul>
              </div>
            : null
          }
        </span>
        <span className={`${styles.feedback} ${recipient.error ? 'error' : ''} ${recipient.feedback ? styles.show : ''}`}>
          {recipient.feedback}
        </span>
      </Fragment>
    );
  }
}

export default Bookmark;
