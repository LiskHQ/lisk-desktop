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
    const { tag, description, timestamp } = this.props;
    const hours = new Date().getHours() - timestamp.getHours();
    const timestampMessage = hours ? `${hours}h ago` : 'just now';
    return (
      <div className={'news'}>
        <div className={styles.header}>
          <div className={styles.tag}>{tag}</div>
          <div className={styles.timestampMessage}>{timestampMessage}</div>
        </div>
        <div className={styles.description}>
          {this.state.readMore && description.length > 50 ?
            description : description.slice(0, 50)}
        </div>
        {!this.state.readMore ?
          <div
            className={styles.readMore}
            onClick={() => {
              this.setState({ readMore: true });
            }}>Read more</div>
          : ''}
      </div>
    );
  }
}

export default News;
