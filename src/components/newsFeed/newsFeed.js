import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import { FontIcon } from '../fontIcon';
import SettingsNewsFeed from './settingsNewsFeed';

class NewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
    };
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  hideSettings() {
    this.setState({ showSettings: false });
  }

  setNewsChannel(data) {
    this.props.setNewsChannel(data);
  }

  render() {
    const settingsButton = this.state.showSettings ?
      (<div className={styles.settingsButton} onClick={() => { this.hideSettings(); }}>
        <span>BACK</span>
      </div>) :
      (<div className={styles.settingsButton} onClick={() => { this.openSettings(); }}>
        <FontIcon className='online' value='edit' />
      </div>);
    return (
      <div className={styles.newsFeed}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('News')}</h2>
          </header>
          {settingsButton}
        </div>
        {this.state.showSettings ?
          <form className={styles.form}>
            <SettingsNewsFeed
              t={this.props.t}
              channels={this.props.channels}
              hideSettings={this.hideSettings.bind(this)}
              setNewsChannel={this.setNewsChannel.bind(this)} />
          </form> :
          <form className={styles.form}>
            {this.props.newsFeed.map((news, index) => (
              <div className={styles.newsWrapper} key={`newsWrapper-${index}`}>
                <News {...news} />
              </div>
            ))}
          </form>
        }
        <footer>
        </footer>
      </div>
    );
  }
}

export default NewsFeed;
