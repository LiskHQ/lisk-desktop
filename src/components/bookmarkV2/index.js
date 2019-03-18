import React, { Fragment } from 'react';
import AccountVisual from '../accountVisual/index';
import { InputV2 } from '../toolbox/inputsV2';
import keyCodes from './../../constants/keyCodes';
import svg from '../../utils/svgIcons';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import styles from './bookmark.css';

// eslint-disable-next-line complexity
class Bookmark extends React.Component {
  // eslint-disable-next-line max-statements
  constructor(props) {
    super(props);

    this.state = {
      dropdownIndex: 0,
      isLoading: false,
    };

    this.loaderTimeout = null;
    this.listContainerRef = null;

    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.onKeyPressDownOrUp = this.onKeyPressDownOrUp.bind(this);
    this.onKeyPressEnter = this.onKeyPressEnter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.resetListIndex = this.resetListIndex.bind(this);
  }

  getFilterList() {
    const { followedAccounts, recipient } = this.props;

    return followedAccounts
      .filter(account =>
        account.title.toLowerCase().includes(recipient.value.toLowerCase()) ||
        account.address.toLowerCase().includes(recipient.value.toLowerCase()));
  }

  resetListIndex() {
    this.setState({ dropdownIndex: 0 });
  }

  onSelectedAccount(account) {
    this.setState({ isLoading: false });
    this.resetListIndex();
    this.props.onSelectedAccount(account);
  }

  onKeyPressDownOrUp(action) {
    const rowHeight = 44;
    const { dropdownIndex } = this.state;
    const accountsLength = this.getFilterList().length;

    // istanbul ignore else
    if (action === 'down' && dropdownIndex < accountsLength - 1) {
      if (dropdownIndex + 1 >= 4) {
        this.listContainerRef.scrollTop = this.listContainerRef.scrollTop + rowHeight;
      }
      this.setState({ dropdownIndex: dropdownIndex + 1 });
    }

    // istanbul ignore else
    if (action === 'up' && dropdownIndex > 0) {
      this.listContainerRef.scrollTop = this.listContainerRef.scrollTop > 0
        && (dropdownIndex - 1) * rowHeight < this.listContainerRef.scrollTop
        ? this.listContainerRef.scrollTop - rowHeight
        : this.listContainerRef.scrollTop;
      this.setState({ dropdownIndex: dropdownIndex - 1 });
    }
  }

  onKeyPressEnter() {
    const { dropdownIndex } = this.state;
    const account = this.getFilterList()[dropdownIndex];
    this.onSelectedAccount(account);
  }

  onHandleKeyPress(e) {
    // istanbul ignore else
    if (this.props.showSuggestions) {
      switch (e.keyCode) {
        case keyCodes.arrowDown:
          this.onKeyPressDownOrUp('down');
          break;
        case keyCodes.arrowUp:
          this.onKeyPressDownOrUp('up');
          break;
        case keyCodes.enter:
          this.onKeyPressEnter();
          break;
        // istanbul ignore next
        default:
          break;
      }
    }
  }

  onChange(e) {
    clearTimeout(this.loaderTimeout);
    this.setState({ isLoading: true });
    this.loaderTimeout = setTimeout(() => {
      // istanbul ignore else
      if (this.getFilterList().length === 0) this.setState({ isLoading: false });
      this.props.validateBookmark();
    }, 300);

    if (e && e.target && e.target.value === '') this.resetListIndex();
    this.props.onChange(e);
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      recipient,
      placeholder,
      showSuggestions,
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
            className={`${styles.input} ${recipient.error ? 'error' : ''} ${showAccountVisual ? styles.moveTextToRight : ''} recipient bookmark`}
            name={'recipient'}
            value={selectedAccount}
            placeholder={placeholder}
            onKeyDown={this.onHandleKeyPress}
            onChange={this.onChange}
          />
          <SpinnerV2 className={`${styles.spinner} ${this.state.isLoading && recipient.value ? styles.show : styles.hide}`}/>
          <img
            className={`${styles.status} ${!this.state.isLoading && recipient.value ? styles.show : styles.hide}`}
            src={ recipient.error ? svg.alert_icon : svg.ok_icon}
          />
          {
            showSuggestions && recipient.value !== ''
            ? <div className={styles.bookmarkContainer}>
                <div ref={(node) => { this.listContainerRef = node; }}>
                  <ul className={`${styles.bookmarkList} bookmark-list`}>
                  {
                    this.getFilterList()
                    .map((account, index) =>
                      <li
                        key={index}
                        onClick={() => this.onSelectedAccount(account)}
                        className={`${dropdownIndex === index ? styles.active : ''}`}>
                        <AccountVisual address={account.address} size={25} />
                        <span>{account.title}</span>
                        <span>{account.address}</span>
                      </li>)
                  }
                  </ul>
                </div>
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
