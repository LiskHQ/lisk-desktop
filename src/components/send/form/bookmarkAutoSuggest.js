import React from 'react';
import { getNetworkCode } from '../../../utils/api/btc/network';
import { validateAddress } from '../../../utils/validators';
import AccountVisual from '../../accountVisual';
import AutoSuggest from '../../toolbox/autoSuggest';

class BookmarkAutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.validateBookmark = this.validateBookmark.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
  }

  componentDidMount() {
    this.checkIfBookmarkedAccount();
  }

  checkIfBookmarkedAccount() {
    const { recipient, bookmarks } = this.props;
    const account = bookmarks.length
      ? bookmarks.find(acc => acc.address === recipient.address)
      : false;

    // istanbul ignore if
    if (account) this.props.onSelectedAccount(account);
  }

  // istanbul ignore next
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

    this.props.updateField('recipient', {
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

  // istanbul ignore next
  onSelectedAccount(account) {
    const { recipient } = this.props;
    this.props.updateField('recipient', {
      ...recipient,
      ...account,
      value: account.address,
      selected: true,
      error: false,
      feedback: '',
    });
  }

  render() {
    const {
      t, recipient, bookmarks, onInputChange,
    } = this.props;
    const items = bookmarks;
    return (
      <AutoSuggest
        className="recipient"
        onChangeDelayed={this.validateBookmark}
        items={items}
        onChange={onInputChange}
        placeholder={t('Insert public address or a name')}
        selectedItem={recipient}
        onSelectItem={this.onSelectedAccount}
        renderIcon={() => (
          <AccountVisual
            address={recipient.address}
            placeholder={!(recipient.address.length && !recipient.error)}
            size={25}
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

export default BookmarkAutoSuggest;
