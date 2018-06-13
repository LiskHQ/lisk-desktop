import React from 'react';
import styles from './newsFeed.css';
import News from './news';
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

  render() {
    return (
      <div className={styles.newsFeed}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('News')}</h2>
          </header>
          <div onClick={() => { this.openSettings(); }}>
            Open Settings
          </div>
        </div>
        {this.state.showSettings ?
          <SettingsNewsFeed hideSettings={this.hideSettings.bind(this)} /> :
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
