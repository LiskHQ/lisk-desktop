import React from 'react';
import moment from 'moment';
import Icon from '../../../toolbox/icon';
import styles from './news.css';

const News = ({
  content, timestamp, url, title, author,
}) => {
  const date = moment.unix(timestamp).format('DD MMM YYYY');
  const newsTitle = title || author;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${styles.news} news-item`}>
      <div className={styles.header}>
        <Icon name="newsFeedAvatar" />
        <div>
          <span className={styles.title}>{newsTitle}</span>
          <span className={styles.subtitle}>{date}</span>
        </div>
      </div>
      <div className={styles.description}>
        {url ? content.replace(url, '') : url}
      </div>
    </a>
  );
};

export default News;
