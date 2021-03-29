import React from 'react';
import PropTypes from 'prop-types';
import { getIndexOfBookmark } from '@utils/bookmarks';
import { Input } from '@toolbox/inputs';
import { PrimaryButton, WarningButton } from '@toolbox/buttons';
import styles from './bookmarkDropdown.css';

const bookmarkCharLength = 20;

class Bookmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account: {},
      fields: {
        accountName: {
          value: null,
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
    this.handleInputClick = this.handleInputClick.bind(this);
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
    if (value && fields.accountName.value === null) {
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
      address, bookmarks, delegate, bookmarkAdded, bookmarkUpdated,
      token, publicKey, onSubmitClick,
    } = this.props;
    const title = this.state.fields.accountName.value;
    const account = {
      address,
      title,
      isDelegate: !!(delegate && delegate.username),
      publicKey,
    };
    const accounts = bookmarks[token];
    const bookmarkAlreadyExists = this.props.bookmarks[token].some(
      item => item.address === address,
    );
    const bookmarkIndex = bookmarkAlreadyExists ? this.state.bookmarkIndex : accounts.length;

    if (bookmarkAlreadyExists) bookmarkUpdated({ account, token });
    else bookmarkAdded({ account, token });

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
    const {
      token, bookmarks, bookmarkRemoved, onSubmitClick,
    } = this.props;
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
          feedback: '',
          value: null,
          isReadOnly: false,
        },
      },
    });

    onSubmitClick();
  }

  handleAccountNameChange({ target }) {
    const { fields } = this.state;
    const feedback = target.value.length <= bookmarkCharLength
      ? this.props.t('{{length}} out of {{maxLength}} characters left', {
        length: bookmarkCharLength - target.value.length,
        maxLength: bookmarkCharLength,
      })
      : this.props.t('{{length}} extra characters', { length: target.value.length - bookmarkCharLength });

    const field = {
      ...fields[target.name],
      value: target.value,
      error: target.value.length > bookmarkCharLength,
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
        isValid: target.value.length <= bookmarkCharLength && target.value.length > 0,
      });
    }, 300);

    this.setState({
      fields: {
        ...fields,
        [target.name]: {
          ...field,
          loading: target.value.length <= bookmarkCharLength,
        },
      },
      isValid: false,
    });
  }

  handleInputClick() {
    const { fields } = this.state;
    const isDelegate = Object.keys(this.props.delegate).length;

    this.setState({
      fields: {
        ...fields,
        accountName: {
          ...fields.accountName,
          isReadOnly: !!isDelegate,
        },

      },
    });
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      t, isBookmark, bookmarks, address, token,
    } = this.props;
    const { isValid, fields } = this.state;
    const { accountName } = fields;
    const index = getIndexOfBookmark(bookmarks, { address, token });
    const accounts = bookmarks[token];
    const oldBookmarkName = accounts[index] && accounts[index].title;
    const hasValueChanged = accountName.value !== oldBookmarkName;
    const { value } = fields.accountName;

    return (
      <section className={`${styles.wrapper}`}>
        <h6>{isBookmark ? t('Edit bookmark') : t('Add bookmark')}</h6>
        <div className={`${styles.fieldInput} account-title`}>
          <label className={`${styles.fieldGroup}`}>{t('Account name')}</label>
          <Input
            maxLength={40}
            autoComplete="off"
            onChange={this.handleAccountNameChange}
            name="accountName"
            value={fields.accountName.value || ''}
            placeholder={t('ie. Lisker123')}
            onClick={this.handleInputClick}
            readOnly={fields.accountName.isReadOnly}
            className={`${styles.input} ${fields.accountName.error ? 'error' : ''}`}
            feedback={accountName.feedback}
            isLoading={accountName.loading}
            size="xs"
            status={accountName.error ? 'error' : 'ok'}
          />
        </div>
        {isBookmark ? (
          <React.Fragment>
            <div className={`${styles.editButtonContainer} ${hasValueChanged ? styles.show : styles.hide}`}>
              <PrimaryButton
                className="bookmark-button"
                disabled={!value || value.length > bookmarkCharLength}
                size="s"
                onClick={this.handleBookmark}
              >
                {t('Save changes')}
              </PrimaryButton>
            </div>
            <WarningButton
              className="bookmark-button"
              size="s"
              onClick={this.handleUnbookmark}
            >
              {t('Remove bookmark')}
            </WarningButton>
          </React.Fragment>
        ) : (
          <PrimaryButton
            className="bookmark-button"
            size="xs"
            onClick={this.handleBookmark}
            disabled={!isValid}
          >
            {t('Confirm')}
          </PrimaryButton>
        )}
      </section>
    );
  }
}

Bookmark.propTypes = {
  address: PropTypes.string.isRequired,
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
  isBookmark: false,
  bookmarkAdded: () => null,
  bookmarkRemoved: () => null,
  delegate: {},
  onSubmitClick: () => null,
};

export default Bookmark;
