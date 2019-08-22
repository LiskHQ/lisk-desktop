import React, { Fragment } from 'react';
import AccountVisual from '../../accountVisual/index';
import { Input } from '../inputs';
import keyCodes from '../../../constants/keyCodes';
import Spinner from '../../spinner/spinner';
import Feedback from '../feedback/feedback';
import styles from './autoSuggest.css';
import Icon from '../icon';

// eslint-disable-next-line complexity
class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownIndex: 0,
      isLoading: false,
    };

    this.loaderTimeout = null;
    this.listContainerRef = null;
    this.input = null;

    this.bindAll();
  }

  bindAll() {
    this.onHandleKeyPress = this.onHandleKeyPress.bind(this);
    this.getFilterList = this.getFilterList.bind(this);
    this.onKeyPressDownOrUp = this.onKeyPressDownOrUp.bind(this);
    this.onKeyPressEnter = this.onKeyPressEnter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.resetListIndex = this.resetListIndex.bind(this);
    this.handleUpdateIndex = this.handleUpdateIndex.bind(this);
  }

  getFilterList() {
    const { items, recipient } = this.props;

    if (recipient.value === '') return items;


    return items
      .filter(account =>
        account.title.toLowerCase().includes(recipient.value.toLowerCase())
        || account.address.toLowerCase().includes(recipient.value.toLowerCase()));
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

  handleUpdateIndex(dropdownIndex) {
    this.setState({ dropdownIndex });
  }

  onKeyPressEnter() {
    const { dropdownIndex } = this.state;
    const account = this.getFilterList()[dropdownIndex];
    this.onSelectedAccount(account);
  }

  onHandleKeyPress(e) {
    // istanbul ignore else
    if (this.getFilterList().length) {
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
      if (this.getFilterList().length >= 0) this.setState({ isLoading: false });
      this.props.validateBookmark();
    }, 300);

    if (e && e.target && e.target.value === '') this.resetListIndex();
    this.props.onChange(e);
  }

  render() {
    const {
      recipient,
      placeholder,
    } = this.props;
    const { dropdownIndex } = this.state;
    const haveAvatar = recipient.address.length && !recipient.error;
    const selectedAccount = recipient.selected ? recipient.title : recipient.value;

    return (
      <Fragment>
        <span className={`${styles.recipientField} recipient`}>
          <AccountVisual
            className={styles.accountVisual}
            address={recipient.address}
            placeholder={!haveAvatar}
            size={25}
          />
          <Input
            autoComplete="off"
            className={`${styles.input} ${recipient.error ? 'error' : ''} recipient bookmark`}
            name="recipient"
            value={selectedAccount}
            placeholder={placeholder}
            onKeyDown={this.onHandleKeyPress}
            onChange={this.onChange}
          />
          <Spinner className={`${styles.spinner} ${this.state.isLoading && recipient.value ? styles.show : styles.hide}`} />
          <Icon
            className={`${styles.status} ${!this.state.isLoading && recipient.value ? styles.show : styles.hide}`}
            name={recipient.error ? 'alertIcon' : 'okIcon'}
          />
          <div className={`${styles.bookmarkContainer}`}>
            <div ref={(node) => { this.listContainerRef = node; }}>
              <ul className={`${styles.bookmarkList} bookmark-list`}>
                {
                this.getFilterList()
                  .map((account, index) => (
                    <li
                      key={index}
                      onMouseEnter={() => this.handleUpdateIndex(index)}
                      onClick={() => this.onSelectedAccount(account)}
                      onKeyPress={this.onHandleKeyPress}
                      className={`${dropdownIndex === index ? styles.active : ''}`}
                    >
                      <AccountVisual address={account.address} size={25} />
                      <span>{account.title}</span>
                      <span>{account.address}</span>
                    </li>
                  ))
              }
              </ul>
            </div>
          </div>
        </span>

        <Feedback
          show={recipient.error || false}
          status="error"
          className={styles.feedbackMessage}
          showIcon={false}
        >
          {recipient.feedback}
        </Feedback>
      </Fragment>
    );
  }
}

export default AutoSuggest;
