import React from 'react';
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
        onChangeDelayed={validateBookmark}
        items={bookmarks[token]}
        onChange={onInputChange}
        placeholder={t('Insert public address or a name')}
        recipient={recipient}
        onSelectItem={onSelectedAccount}
        token={token}
      />
    );
  }
}

export default BookmarkAutoSuggest;
