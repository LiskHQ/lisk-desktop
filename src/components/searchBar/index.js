import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import keyCodes from './../../constants/keyCodes';
import routes from './../../constants/routes';
import styles from './searchBar.css';

class Search extends React.Component {
  keyAction(event) {
    if (event.which === keyCodes.enter) {
      const { value } = event.target;
      const addressRegex = /^\d{1,21}[L|l]$/;
      const txIdRegex = /^[0-9]+$/;

      if (value.match(addressRegex)) {
        this.props.history.push(`${routes.account.long}/${value}`);
      }

      if (value.match(txIdRegex)) {
        // TODO: will be implemented in #246
        this.props.history.push('/');
      }

      // TODO: case of no match
    }
  }

  render() {
    const { t } = this.props;
    return <div className={styles.search}>
      <div className={styles.wrapper}>
        <input onKeyUp={(e) => { this.keyAction(e); } } className={styles.input} type="text" placeholder={t('Search for Lisk ID or Transaction ID')}/>
      </div>
    </div>;
  }
}
export default withRouter(translate()(Search));
