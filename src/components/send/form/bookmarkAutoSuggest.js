import React from 'react';
import AccountVisual from '../../accountVisual';
import AutoSuggest from '../../toolbox/autoSuggest';

class BookmarkAutoSuggest extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t, token, recipient, onSelectedAccount, validateBookmark, bookmarks, onInputChange,
    } = this.props;
    return (
      <AutoSuggest
        className="recipient"
        onChangeDelayed={validateBookmark}
        items={bookmarks[token]}
        onChange={onInputChange}
        placeholder={t('Insert public address or a name')}
        recipient={recipient}
        onSelectItem={onSelectedAccount}
        token={token}
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
      />
    );
  }
}

export default BookmarkAutoSuggest;
