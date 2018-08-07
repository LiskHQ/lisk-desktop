import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import { FontIcon } from '../fontIcon';
import SettingsNewsFeed from './settingsNewsFeed';
import liskServiceApi from '../../utils/api/liskService';

class NewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
      newsFeed: [],
    };
    this.updateData();
  }


  updateData() {
    liskServiceApi.getNewsFeed().then((newsFeed) => {
      const sortedNewsFeed = newsFeed.sort((newsFeedA, newsFeedB) => (
        new Date(newsFeedB.timestamp) - new Date(newsFeedA.timestamp)
      ));
      this.setState({ newsFeed: sortedNewsFeed });
    }).catch((error) => {
      this.setState({ error });
    });
  }

  openSettings() {
    this.setState({ showSettings: true });
  }

  hideSettings() {
    this.setState({ showSettings: false });
  }

  setNewsChannels(data) {
    this.props.settingsUpdated(data);
  }

  render() {
    const settingsButton = this.state.showSettings ?
      (<div className={styles.settingsButton} onClick={() => { this.hideSettings(); }}>
        <span>Done</span>
      </div>) :
      (<div className={styles.settingsButton} onClick={() => { this.openSettings(); }}>
        <FontIcon className='online' value='edit' />
      </div>);

    const filteredNewsFeed = this.state.newsFeed.filter(feed => this.props.channels[feed.source]);
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
              setNewsChannels={this.setNewsChannels.bind(this)} />
          </form> :
          <form className={styles.form}>
            {filteredNewsFeed.map((news, index) => (
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
