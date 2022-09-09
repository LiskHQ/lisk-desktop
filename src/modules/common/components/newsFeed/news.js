import React from 'react';
import moment from 'moment';
import Icon from '@theme/Icon';
import NewsParser from './newsParser';
import styles from './news.css';

const News = ({ content, createdAt, url, title, author, imageUrl, source, t }) => {
  const date = moment.unix(createdAt).format('DD MMM YYYY');
  const newsTitle = title || author;
  const authorText =
    author === 'LiskHQ' ? null : (
      <span>
        <span>{t('Written by')}</span>
        <span> </span>
        <b className={styles.author}>{author}</b>
      </span>
    );
  const iconSource = source === 'twitter_lisk' ? 'newsFeedTwitter' : 'newsFeedBlog';
  return (
    <div
      className={`${styles.news} news-item`}
      onClick={() => window.open(url, '_blank', 'rel="noopener noreferrer')}
    >
      <div className={styles.header}>
        <Icon name={iconSource} className={styles.icon} />
        <div>
          <span className={styles.title}>{newsTitle}</span>
          <span className={styles.subtitle}>
            {authorText}
            {date}
          </span>
        </div>
      </div>
      <div className={styles.description}>
        <NewsParser>{content.replace(/<br \/>/g, '').replace(url, '')}</NewsParser>
      </div>
      {
        // eslint-disable-next-line camelcase
        imageUrl ? <img className={styles.img} src={imageUrl} alt={title} /> : null
      }
    </div>
  );
};

export default News;
