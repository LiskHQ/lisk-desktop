import React from 'react';
import { translate } from 'react-i18next';
import styles from './autoSuggest.css';

class AutoSuggest extends React.Component {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { history, t } = this.props;
    return (<div className={styles.autoSuggest}></div>);
  }
}

export default translate()(AutoSuggest);
