import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../box';
import { FontIcon } from '../fontIcon';
import SettingsNewsFeed from './settingsNewsFeed';
import logo from '../../assets/images/Lisk-Logo.svg';
import Piwik from '../../utils/piwik';
import ShowMore from '../showMore';

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
    Piwik.trackingEvent('NewsFeed', 'button', 'Open settings');
    this.setState({ showSettings: true });
  }

  hideSettings() {
    Piwik.trackingEvent('NewsFeed', 'button', 'Hide settings');
    this.setState({ showSettings: false });
  }

  setNewsChannels(data) {
    this.props.settingsUpdated(data);
  }

  onShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  render() { // eslint-disable-line complexity
    const settingsButton = this.state.showSettings ?
      (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.hideSettings(); }}>
        <span>{this.props.t('Done')}</span>
      </div>) :
      (<div className={`settingsButton ${styles.settingsButton}`} onClick={() => { this.openSettings(); }}>
        <FontIcon className='online' value='edit' />
      </div>);

    const onShowMore = this.state.showMore ? styles.showMore : '';

    const filteredNewsFeed =
      this.props.newsFeed.filter(feed => this.props.channels[feed.source]) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <div className={`${styles.newsFeed} ${onShowMore}`}>
          <div className={styles.header}>
            <header className={styles.headerWrapper}>
              <h2>{this.props.t('News')}</h2>
            </header>
            {settingsButton}
          </div>
          <div className={`${styles.container} ${onShowMore}`}>
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
          {
            filteredNewsFeed.length >= 4 && !this.state.showSettings &&
            <ShowMore
              className={`${styles.showMoreAlign} show-more`}
              onClick={() => this.onShowMore()}
              text={this.state.showMore ? this.props.t('Show Less') : this.props.t('Show More')}
            />
          }
        </div>
      </Box>
    );
  }
}

export default NewsFeed;
