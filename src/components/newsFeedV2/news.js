import React from 'react';
import svg from '../../utils/svgIcons';
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
      source, content, timestamp, url,
    } = this.props;

    const hours = Math.floor(Math.abs(new Date() - new Date(timestamp)) / 36e5);
    // istanbul ignore next
    let timestampMessage = hours ? `${hours}h ago` : 'just now';
    // istanbul ignore next
    timestampMessage = hours > 24 ? `${Math.floor(hours / 24)}d ago` : timestampMessage;

    // Makes first letter capital
    const sourceName = source.charAt(0).toUpperCase() + source.substr(1);
    return (
      <div className={`news-item ${styles.news}`}>
        <div className={styles.header}>
          <img src={svg.newsFeedAvatar} />
          <div>
            <span className={styles.title}>{sourceName}</span>
            <span className={styles.subtitle}>{timestampMessage}</span>
          </div>
        </div>
        <div className={styles.description}>
          {url ? content.replace(url, '') : url}
        </div>
      </div>
    );
  }
}

export default News;
