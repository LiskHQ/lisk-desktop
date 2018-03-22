import React from 'react';
import ProgressBar from '../toolbox/progressBar/progressBar';
import styles from './loadingBar.css';

class LoadingBar extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.markedAsLoaded = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading && nextProps.loading.length > 0 && this.props.loading.length === 0) {
      this.startTime = new Date();
      this.setState({ visible: true });
    }
    if (nextProps.loading && nextProps.loading.length === 0 && this.props.loading.length > 0) {
      const timeDiff = new Date() - this.startTime;
      const animationDuration = 1000;
      this.timeout = setTimeout(() => {
        this.setState({ visible: false });
      }, animationDuration - (timeDiff % animationDuration));
    }

    if (!this.markedAsLoaded && nextProps.peers.data) {
      this.markedAsLoaded = true;
      this.props.markAsLoaded();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return <div className={styles.fixedAtTop}>
      {this.state.visible ?
        <ProgressBar type="linear" mode="indeterminate" theme={styles}/> :
        null
      }
    </div>;
  }
}

export default LoadingBar;
