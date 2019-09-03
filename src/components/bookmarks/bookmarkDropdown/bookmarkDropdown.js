import React from 'react';
import PropTypes from 'prop-types';
import { getIndexOfBookmark } from '../../../utils/bookmarks';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton } from '../../toolbox/buttons/button';
import styles from './bookmarkDropdown.css';

class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: {},
      fields: {
        accountName: {
          value: '',
          error: false,
          feedback: '',
          loading: false,
          isReadOnly: false,
        },
        dashboard: {
          value: true,
        },
      },
      bookmarkIndex: -1,
      isValid: false,
    };

    this.timeout = null;

    this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
    this.handleUnbookmark = this.handleUnbookmark.bind(this);
    this.handleBookmark = this.handleBookmark.bind(this);
    this.setBookmark = this.setBookmark.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  // eslint-disable-next-line max-statements
  componentDidUpdate() {
    if (this.props.delegate.username || this.props.isBookmark) {
      this.setBookmark();
    }
  }

  componentDidMount() {
    if (this.props.isBookmark) {
      this.setBookmark();
    }
  }

  setBookmark() {
    const {
      bookmarks, address, delegate, token,
    } = this.props;
    const { fields } = this.state;
    const index = getIndexOfBookmark(bookmarks, { address, token });
    const accounts = bookmarks[token];
    const bookmarkTitle = accounts[index] && accounts[index].title;
    const delegateTitle = delegate && delegate.username;
    const value = delegateTitle || bookmarkTitle || '';
    if (value !== fields.accountName.value) {
      this.setState({
        fields: {
          ...fields,
          accountName: {
            ...fields.accountName,
            value,
            isReadOnly: true,
          },
        },
        isValid: true,
        bookmarkIndex: index,
      });
    }
  }

  handleBookmark() {
    const {
      address, bookmarks, delegate, bookmarkAdded,
      token, detailAccount, onSubmitClick,
    } = this.props;
    const title = this.state.fields.accountName.value;
    const account = {
      address,
      title,
      isDelegate: !!(delegate && delegate.username),
      publicKey: (detailAccount && detailAccount.publicKey) || null,
    };
    const accounts = bookmarks[token];
    const bookmarkIndex = accounts.length;
    bookmarkAdded({ account, token });
    this.setState({
      account,
      bookmarkIndex,
      fields: {
        ...this.state.fields,
        accountName: {
          ...this.state.fields.accountName,
          isReadOnly: true,
        },
      },
    });
    onSubmitClick();
  }

  handleUnbookmark() {
    const { fields, bookmarkIndex } = this.state;
    const { token, bookmarks, bookmarkRemoved } = this.props;
    const accounts = bookmarks[token];
    const data = {
      address: accounts[bookmarkIndex] && accounts[bookmarkIndex].address,
      token,
    };
    bookmarkRemoved(data);
    this.setState({
      isValid: false,
      fields: {
        ...fields,
        accountName: {
          ...fields.accountName,
          value: '',
          isReadOnly: false,
        },
      },
    });
  }

  handleAccountNameChange({ target }) {
    const { fields } = this.state;
    const maxLength = 20;
    const feedback = target.value.length <= maxLength
      ? this.props.t('{{length}} out of {{maxLength}} characters left', {
        length: maxLength - target.value.length,
        maxLength,
      })
      : this.props.t('{{length}} extra characters', { length: target.value.length - maxLength });

    const field = {
      ...fields[target.name],
      value: target.value,
      error: target.value.length > maxLength,
      feedback,
    };

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({
        fields: {
          ...fields,
          [target.name]: {
            ...field,
            loading: false,
          },
        },
        isValid: target.value.length <= maxLength && target.value.length > 0,
      });
    }, 300);

    this.setState({
      fields: {
        ...fields,
        [target.name]: {
          ...field,
          loading: target.value.length <= maxLength,
        },
      },
      isValid: false,
    });
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, isBookmark } = this.props;
    const { isValid, fields } = this.state;
    const { accountName } = fields;

    return (
      <section className={`${styles.wrapper}`}>
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Account name')}</span>
          <span className={`${styles.fieldInput} account-title`}>
            <Input
              maxLength={40}
              autoComplete="off"
              onChange={this.handleAccountNameChange}
              name="accountName"
              value={fields.accountName.value}
              placeholder={t('ie. Lisker123')}
              readOnly={fields.accountName.isReadOnly}
              className={`${styles.input} ${fields.accountName.error ? 'error' : ''}`}
              feedback={accountName.feedback}
              isLoading={accountName.loading}
              size="s"
              {...{}/* eslint-disable-next-line no-nested-ternary */}
              status={accountName.value && !accountName.isReadOnly && !accountName.loading
                ? (accountName.error ? 'error' : 'ok') : undefined}
            />
          </span>
        </label>
        {/* <label className={`${styles.fieldGroup} ${styles.checkboxGroup}`}>
          <input checked={fields.dashboard.value} type='checkbox' readOnly />
          <span className={`${styles.fakeCheckbox}`}>
            <FontIcon className={`${styles.icon}`}>checkmark</FontIcon>
          </span>
          <div className={`${styles.checkboxInfo}`}>
            <span className={`${styles.label}`}>{t('On your dashboard')}</span>
            <span className={`${styles.note}`}>
              {t('Show this account\'s transactions on the dashboard.')}
            </span>
          </div>
          </label> */}
        {isBookmark
          ? (
            <PrimaryButton
              className="bookmark-button extra-small"
              onClick={this.handleUnbookmark}
            >
              {t('Remove from bookmarks')}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="bookmark-button extra-small"
              onClick={this.handleBookmark}
              disabled={!isValid}
            >
              {t('Confirm')}
            </PrimaryButton>
          )
        }
      </section>
    );
  }
}

Bookmark.propTypes = {
  address: PropTypes.string.isRequired,
  accounts: PropTypes.object.isRequired,
  isBookmark: PropTypes.bool.isRequired,
  bookmarks: PropTypes.object.isRequired,
  bookmarkAdded: PropTypes.func.isRequired,
  bookmarkRemoved: PropTypes.func.isRequired,
  delegate: PropTypes.object.isRequired,
  onSubmitClick: PropTypes.func,
};

/* istanbul ignore next */
Bookmark.defaultProps = {
  address: '',
  accounts: {},
  isBookmark: false,
  bookmarkAdded: () => null,
  bookmarkRemoved: () => null,
  delegate: {},
  onSubmitClick: () => null,
};

export default Bookmark;
