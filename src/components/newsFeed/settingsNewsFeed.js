import React from 'react';
import styles from './newsFeed.css';

class SettingsNewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
    };
  }

  render() {
    return (
      <div className={styles.newsFeed}>
        <div onClick={() => { this.props.hideSettings(); }}>BACK</div>
        Settings
      </div>
    );
  }
}

export default SettingsNewsFeed;
