import React from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../../../toolbox/box';
import BoxRow from '../../../toolbox/box/row';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Icon from '../../../toolbox/icon';

class NewsFeed extends React.Component {
  render() {
    const {
      channels,
      newsFeed,
      t,
    } = this.props;

    const filteredNewsFeed = newsFeed.data.filter(feed => channels[feed.source]) || [];

    return (
      <Box className="newsFeed-box">
        <BoxHeader>
          <h1>{t('Community feed')}</h1>
        </BoxHeader>
        <BoxContent className={styles.container}>
          {
              filteredNewsFeed.length
                ? filteredNewsFeed.map(news => (
                  <BoxRow isClickable key={news.sourceId} className={styles.row}>
                    <News
                      t={t}
                      {...news}
                    />
                  </BoxRow>
                ))
                : null
            }
          {
              newsFeed.error && (
                <BoxEmptyState className="empty-news">
                  <Icon name="noTweetsIcon" />
                  <h1>{t('No available tweets')}</h1>
                  <p>{t('At this moment there is a connection problem with the tweets feed')}</p>
                </BoxEmptyState>
              )
            }
        </BoxContent>
      </Box>
    );
  }
}

export default NewsFeed;
