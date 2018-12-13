import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../box';
import { FontIcon } from '../fontIcon';
import SettingsNewsFeed from './settingsNewsFeed';
import logo from '../../assets/images/Lisk-Logo.svg';

class NewsFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
    };

    props.getNewsFeed();
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
    const settingsButton = this.state.showSettings
      ? (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.hideSettings(); }}>
        <span>{this.props.t('Done')}</span>
      </div>)
      : (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.openSettings(); }}>
        <FontIcon className='online' value='edit' />
      </div>);

    const filteredNewsFeed = this.props.newsFeed.filter(
      feed => this.props.channels[feed.source],
    ) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <div className={styles.newsFeed}>
          <div className={styles.header}>
            <header className={styles.headerWrapper}>
              <h2>{this.props.t('News')}</h2>
            </header>
            {settingsButton}
          </div>
          <div className={styles.container}>
            {this.state.showSettings
              ? <SettingsNewsFeed
                t={this.props.t}
                channels={this.props.channels}
                hideSettings={this.hideSettings.bind(this)}
                setNewsChannels={this.setNewsChannels.bind(this)} />
              : <div>
                {filteredNewsFeed.length > 0 ? filteredNewsFeed.map((news, index) => (
                  <div className={styles.newsWrapper} key={`newsWrapper-${index}`}>
                    <News
                      t={this.props.t}
                      {...news} />
                  </div>
                )) : null}
                {this.props.showNewsFeedEmptyState && filteredNewsFeed.length === 0
                  ? <div className={styles.emptyNews}>
                    {this.props.t('No newsfeed chosen – click on edit in the top right corner to add a feed.')}
                    <img className={styles.liskLogo} src={logo} />
                  </div> : null}
              </div>
            }
          </div>
          <footer>
          </footer>
        </div>
      </Box>
    );
  }
}

export default NewsFeed;
