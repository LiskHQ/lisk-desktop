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
      showMore: false,
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

  onShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  render() {
    const settingsButton = this.state.showSettings ?
      (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.hideSettings(); }}>
        <span>{this.props.t('Done')}</span>
      </div>) :
      (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.openSettings(); }}>
        <FontIcon className='online' value='edit' />
      </div>);

    const onHideContent = !this.state.showMore && styles.hideContent;
    const onShowConten = this.state.showMore && styles.showContent;

    const filteredNewsFeed =
      this.props.newsFeed.filter(feed => this.props.channels[feed.source]) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox} ${onShowConten}`}>
        <div className={`${styles.newsFeed} ${onHideContent}`}>
          <div className={styles.header}>
            <header className={styles.headerWrapper}>
              <h2>{this.props.t('News')}</h2>
            </header>
            {settingsButton}
          </div>
          <div className={styles.container}>
            {
              this.state.showSettings ?
              <SettingsNewsFeed
                t={this.props.t}
                channels={this.props.channels}
                hideSettings={this.hideSettings.bind(this)}
                setNewsChannels={this.setNewsChannels.bind(this)} /> :
              <div>
                {
                  filteredNewsFeed.length > 0 &&
                  filteredNewsFeed.map((news, index) =>
                    <div className={styles.newsWrapper} key={`newsWrapper-${index}`}>
                      <News
                        t={this.props.t}
                        {...news} />
                    </div>)
                }
                {
                  this.props.showNewsFeedEmptyState && filteredNewsFeed.length === 0 &&
                  (<div className={styles.emptyNews}>
                    {this.props.t('No newsfeed chosen – click on edit in the top right corner to add a feed.')}
                    <img className={styles.liskLogo} src={logo} />
                  </div>)
                }
              </div>
            }
          </div>
          <footer>
          </footer>
        </div>
        <div
          className={`${styles.showMore}`}
          onClick={() => this.onShowMore()}
        >
        {this.props.t('Show More')}
        </div>
      </Box>
    );
  }
}

export default NewsFeed;
