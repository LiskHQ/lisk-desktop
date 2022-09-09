import React, { useEffect, useState } from 'react';
import Box from '@theme/box';
import BoxRow from '@theme/box/row';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import BoxTabs from '@theme/tabs';
import BoxEmptyState from '@theme/box/emptyState';
import Icon from '@theme/Icon';
import News from './news';
import styles from './newsFeed.css';

const NewsFeed = (props) => {
  const { newsFeed, t } = props;
  const filteredNewsFeed = newsFeed.data || [];
  const sources = ['twitter_lisk', 'drupal_lisk_general'];
  const [source, setSource] = useState(sources.join(','));
  useEffect(() => {
    if (newsFeed && newsFeed.error.length === 0 && newsFeed.data.length === 0) {
      newsFeed.loadData({ source });
    }
  }, [source]);
  const tabs = [
    {
      value: sources.join(','),
      name: t('All'),
    },
    {
      value: sources[0],
      name: t('Twitter'),
    },
    {
      value: sources[1],
      name: t('Blog'),
    },
  ];
  const changeSource = (tab) => {
    setSource(tab.value);
    newsFeed.loadData({ source: tab.value });
  };
  return (
    <Box className="newsFeed-box">
      <BoxHeader>
        <h1>{t('News feed')}</h1>
        <BoxTabs
          tabs={tabs}
          active={source}
          onClick={changeSource}
          className={`box-tabs ${styles.tabs}`}
        />
      </BoxHeader>
      <BoxContent className={styles.container}>
        {filteredNewsFeed.length > 0
          ? filteredNewsFeed.map((news, index) => (
              <BoxRow isClickable key={`${news.sourceId}-${index}`} className={styles.row}>
                <News t={t} {...news} />
              </BoxRow>
            ))
          : null}
        {newsFeed.error && (
          <BoxEmptyState className="empty-news">
            <Icon name="noTweetsIcon" />
            <h1>{t('No available tweets')}</h1>
            <p>{t('At this moment there is a connection problem with the tweets feed')}</p>
          </BoxEmptyState>
        )}
      </BoxContent>
    </Box>
  );
};

export default NewsFeed;
