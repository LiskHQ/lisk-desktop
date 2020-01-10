import PropTypes from 'prop-types';
import React from 'react';
import { getNetworkCode } from '../../../../../utils/api/btc/network';
import { validateAddress } from '../../../../../utils/validators';
import AccountVisual from '../../../../toolbox/accountVisual';
import AutoSuggest from '../../../../toolbox/autoSuggest';
import styles from './form.css';

class BookmarkAutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.fieldName = 'recipient';

    this.validateBookmark = this.validateBookmark.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.checkIfBookmarkedAccount();
  }

  checkIfBookmarkedAccount() {
    const { recipient, bookmarks } = this.props;
    const account = bookmarks.length
      ? bookmarks.find(acc => acc.address === recipient.address)
      : false;

    if (account) this.onSelectedAccount(account);
  }

  validateBookmark() {
    const {
      token, networkConfig, recipient, bookmarks, t,
    } = this.props;
    const isValidBookmark = bookmarks
      .find(account => (account.title.toLowerCase() === recipient.value.toLowerCase())
          || account.address.toLowerCase() === recipient.value.toLowerCase()) || false;
    const isValidAddress = validateAddress(
      token, recipient.value, getNetworkCode(networkConfig),
    ) === 0;
    const isInvalid = !isValidBookmark && !isValidAddress && recipient.value;

    this.props.updateField({
      ...(isInvalid ? {
        feedback: t('Provide a correct wallet address or a name of a bookmarked account'),
        address: '',
      } : {
        feedback: '',
        address: isValidBookmark ? isValidBookmark.address : recipient.value,
      }),
      error: !!isInvalid,
      selected: !!isValidBookmark,
      title: isValidBookmark ? isValidBookmark.title : '',
    });
  }

  onSelectedAccount(account) {
    this.props.updateField({
      ...account,
      value: account.address,
      selected: true,
      error: false,
      feedback: '',
    });
  }

  onInputChange({ target: { value } }) {
    this.props.updateField({ value });
  }

  render() {
    const { t, recipient, bookmarks } = this.props;
    return (
      <AutoSuggest
        className={this.fieldName}
        onChangeDelayed={this.validateBookmark}
        items={bookmarks}
        onChange={this.onInputChange}
        placeholder={t('Insert public address or a name')}
        selectedItem={recipient}
        onSelectItem={this.onSelectedAccount}
        renderIcon={() => (
          <AccountVisual
            address={recipient.address}
            placeholder={!(recipient.address.length && !recipient.error)}
            size={25}
            className={styles.recipientAccountVisual}
          />
        )}
        renderItem={bookmark => (
          <React.Fragment>
            <AccountVisual address={bookmark.address} size={25} />
            <span>{bookmark.title}</span>
            <span>{bookmark.address}</span>
          </React.Fragment>
        )}
        matchProps={['address', 'title']}
      />
    );
  }
}

BookmarkAutoSuggest.propTypes = {
  bookmarks: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  })).isRequired,
  networkConfig: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  recipient: PropTypes.shape({
    address: PropTypes.string.isRequired,
    error: PropTypes.bool.isRequired,
    feedback: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
};

export default BookmarkAutoSuggest;
