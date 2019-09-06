import React from 'react';
import moment from 'moment';
import i18n from '../../i18n';
import Icon from '../toolbox/icon';
import styles from './news.css';

class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readMore: false,
    };
  }

  formatDate = (t, timestamp) => {
    const hours = Math.floor(Math.abs(new Date() - new Date(timestamp)) / 36e5);
    if (hours <= 1) return t('just now');
    if (hours > 1 && hours <= 24) return t('{{hours}}h ago', { hours });
    if (hours > 24 && hours <= 48) return t('Yesterday');
    moment.locale(i18n.language);
    return moment(timestamp).format('DD MMM YYYY');
  }

  render() {
    const {
      source, content, timestamp, url, t,
    } = this.props;

    // Makes first letter capital
    const sourceName = source.charAt(0).toUpperCase() + source.substr(1);
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`${styles.news} news-item`}>
        <div className={styles.header}>
          <Icon name="newsFeedAvatar" />
          <div>
            <span className={styles.title}>{sourceName}</span>
            <span className={styles.subtitle}>{this.formatDate(t, timestamp)}</span>
          </div>
        </div>
        <div className={styles.description}>
          {url ? content.replace(url, '') : url}
        </div>
      </a>
    );
  }
}

export default News;
