import React from 'react';
import PropTypes from 'prop-types';
import { getIndexOfBookmark } from '../../utils/bookmarks';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import svg from '../../utils/svgIcons';
import { InputV2 } from '../toolbox/inputsV2';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import styles from './bookmark.css';

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
      followIndex: -1,
      isValid: false,
    };

    this.timeout = null;

    this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.setFollowed = this.setFollowed.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  // eslint-disable-next-line max-statements
  componentDidUpdate() {
    if (this.props.delegate.username || this.props.isFollowing) {
      this.setFollowed();
    }
  }

  componentDidMount() {
    if (this.props.isFollowing) {
      this.setFollowed();
    }
  }

  setFollowed() {
    const {
      bookmarks, address, delegate, token,
    } = this.props;
    const { fields } = this.state;
    const index = getIndexOfBookmark(bookmarks, { address, token });
    const accounts = bookmarks[token];
    const followedTitle = accounts[index] && accounts[index].title;
    const delegateTitle = delegate.account && delegate.account.address === address
      ? delegate.username : undefined;
    const value = delegateTitle || followedTitle || '';
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
        followIndex: index,
      });
    }
  }

  handleFollow() {
    const {
      address, bookmarks, delegate, bookmarkAdded,
      token, detailAccount,
    } = this.props;
    const title = this.state.fields.accountName.value;
    const account = {
      address,
      title,
      isDelegate: !!(delegate && delegate.username),
      publicKey: (detailAccount && detailAccount.publicKey) || null,
    };
    const accounts = bookmarks[token];
    const followIndex = accounts.length;
    bookmarkAdded({ account, token });
    this.setState({
      account,
      followIndex,
      fields: {
        ...this.state.fields,
        accountName: {
          ...this.state.fields.accountName,
          isReadOnly: true,
        },
      },
    });
  }

  handleUnfollow() {
    const { fields, followIndex } = this.state;
    const { token, bookmarks, bookmarkRemoved } = this.props;
    const accounts = bookmarks[token];
    const data = {
      address: accounts[followIndex] && accounts[followIndex].address,
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
    const { t, isFollowing } = this.props;
    const { isValid, fields } = this.state;

    return (
      <section className={`${styles.wrapper}`}>
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Account Name')}</span>
          <span className={`${styles.fieldInput} account-title`}>
            <InputV2
              maxLength={40}
              autoComplete={'off'}
              onChange={this.handleAccountNameChange}
              name='accountName'
              value={fields.accountName.value}
              placeholder={t('Account Name')}
              readOnly={fields.accountName.isReadOnly}
              className={`${styles.input} ${fields.accountName.error ? 'error' : ''}`} />
            {!fields.accountName.isReadOnly ?
              <React.Fragment>
                <SpinnerV2 className={`${styles.status} ${fields.accountName.loading && fields.accountName.value ? styles.show : ''}`}/>
                <img
                  className={`${styles.status} ${!fields.accountName.loading && fields.accountName.value ? styles.show : ''}`}
                  src={ fields.accountName.error ? svg.alert_icon : svg.ok_icon} />
              </React.Fragment>
            : null}
          </span>
          <span className={`${styles.feedback} ${fields.accountName.error || fields.accountName.value.length >= 15 ? 'error' : ''} ${fields.accountName.value && !isFollowing ? styles.show : ''}`}>
            {fields.accountName.feedback}
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
        {isFollowing
          ? (
            <PrimaryButtonV2
              className={'follow-account-button extra-small'}
              onClick={this.handleUnfollow}>
              {t('Remove from bookmarks')}
            </PrimaryButtonV2>
          ) : (
            <PrimaryButtonV2
              className={'follow-account-button extra-small'}
              onClick={this.handleFollow}
              disabled={!isValid}>
              {t('Confirm')}
            </PrimaryButtonV2>
          )
        }
      </section>
    );
  }
}

Bookmark.propTypes = {
  address: PropTypes.string.isRequired,
  accounts: PropTypes.object.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  bookmarks: PropTypes.object.isRequired,
  bookmarkAdded: PropTypes.func.isRequired,
  bookmarkRemoved: PropTypes.func.isRequired,
  delegate: PropTypes.object.isRequired,
};

/* istanbul ignore next */
Bookmark.defaultProps = {
  address: '',
  accounts: {},
  isFollowing: false,
  bookmarkAdded: () => null,
  bookmarkRemoved: () => null,
  delegate: {},
};

export default Bookmark;
