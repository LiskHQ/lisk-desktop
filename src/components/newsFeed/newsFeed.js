import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../toolbox/box';
import Icon from '../toolbox/icon';

class NewsFeed extends React.Component {
  render() {
    const {
      channels,
      newsFeed,
      t,
    } = this.props;

    const filteredNewsFeed = newsFeed.data.filter(feed => channels[feed.source]) || [];

    return (
      <Box className={`newsFeed-box ${styles.newsFeedBox}`}>
        <Box.Header>
          <h1>{t('Community feed')}</h1>
        </Box.Header>
        <Box.Content className={`${styles.container}`}>
          {
              filteredNewsFeed.length
                ? filteredNewsFeed.map(news => (
                  <Box.Row isClickable key={news.sourceId} className={styles.row}>
                    <News
                      t={t}
                      {...news}
                    />
                  </Box.Row>
                ))
                : null
            }
          {
              newsFeed.error && (
                <Box.EmptyState className="empty-news">
                  <Icon name="noTweetsIcon" />
                  <h1>{t('No available tweets')}</h1>
                  <p>{t('At this moment there is a connection problem with the tweets feed')}</p>
                </Box.EmptyState>
              )
            }
        </Box.Content>
      </Box>
    );
  }
}

export default NewsFeed;
