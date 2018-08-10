import React from 'react';
import styles from './news.css';

class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readMore: false,
    };
  }

  render() {
    const {
      source, content, timestamp, url, t,
    } = this.props;

    const hours = Math.floor(Math.abs(new Date() - new Date(timestamp)) / 36e5);
    // hours, just now
    let timestampMessage = hours ? `${hours}h ago` : 'just now';
    // more than day
    timestampMessage = hours > 24 ? `${Math.floor(hours / 24)} days ago` : timestampMessage;

    // Makes first letter capital
    const sourceName = source.charAt(0).toUpperCase() + source.substr(1);
    return (
      <div className={`news-item ${styles.news}`}>
        <div className={styles.header}>
          <div className={styles.source}>{sourceName}</div>
          <div className={styles.timestampMessage}>{timestampMessage}</div>
        </div>
        <div className={styles.description}>
          {content}
        </div>
        <div className={styles.readMore}>
          <a href={url} target="_blank">{t('Read More')}</a>
        </div>
      </div>
    );
  }
}

export default News;
