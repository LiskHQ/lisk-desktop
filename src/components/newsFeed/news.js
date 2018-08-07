import React from 'react';
import styles from './news.css';

class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      readMore: false,
    };
  }
  // eslint-disable-next-line
  diffHours(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
  }

  render() {
    const {
      source, content, timestamp, url,
    } = this.props;

    const hours = this.diffHours(new Date(), new Date(timestamp));
    // hours, just now
    let timestampMessage = hours ? `${hours}h ago` : 'just now';
    // days
    timestampMessage = hours > 24 ? `${Math.floor(hours / 24)}days ago` : timestampMessage;

    // Makes first letter capital
    const sourceName = source.charAt(0).toUpperCase() + source.substr(1);
    return (
      <div className={styles.news}>
        <div className={styles.header}>
          <div className={styles.source}>{sourceName}</div>
          <div className={styles.timestampMessage}>{timestampMessage}</div>
        </div>
        <div className={styles.description}>
          {/* {this.state.readMore && content.length > 50 ?
            content : content.slice(0, 50)} */}
          {content}
        </div>
        <a href={url}>Read More</a>
        {/* {!this.state.readMore ?
          <div
            className={styles.readMore}
            onClick={() => {
              this.setState({ readMore: true });
            }}>Read more</div>
          : ''} */}
      </div>
    );
  }
}

export default News;
