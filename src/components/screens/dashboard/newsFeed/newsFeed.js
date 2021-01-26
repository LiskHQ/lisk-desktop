import React, { useEffect, useState } from 'react';
import styles from './newsFeed.css';
import News from './news';
import Box from '../../../toolbox/box';
import BoxRow from '../../../toolbox/box/row';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Icon from '../../../toolbox/icon';

const NewsFeed = (props) => {
  const {
    newsFeed,
    t,
  } = props;
  const filteredNewsFeed = newsFeed.data || [];
  const sources = ['twitter_lisk', 'drupal_lisk_general'];
  const [source, setSource] = useState(sources.join(','));
  useEffect(() => {
    if (newsFeed && (newsFeed.error.length === 0 && newsFeed.data.length === 0)) {
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
        {
            filteredNewsFeed.length > 0
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
};

export default NewsFeed;
