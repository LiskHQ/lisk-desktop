import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../boxV2';
import logo from '../../assets/images/Lisk-Logo.svg';

class NewsFeed extends React.Component {
  componentDidMount() {
    this.props.getNewsFeed();
  }

  render() {
    const filteredNewsFeed =
      this.props.newsFeed.filter(feed => this.props.channels[feed.source]) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <header>
          <h1>{this.props.t('Community feed')}</h1>
        </header>

        <div className={`${styles.container}`}>
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
              <div className={`${styles.emptyNews} empty-news`}>
                {this.props.t('No newsfeed available')}
                <img className={styles.liskLogo} src={logo} />
              </div>
            }
          </div>
        </div>
      </Box>
    );
  }
}

export default NewsFeed;
