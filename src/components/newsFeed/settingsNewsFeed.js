import React from 'react';
import Checkbox from '../toolbox/sliderCheckbox';
import styles from './settingsNewsFeed.css';

class SettingsNewsFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
    };
  }

  render() {
    return (
      <form className={styles.form}>
        {Object.keys(this.props.channels).map((channel, index) => (
          <div className={styles.item} key={`channel-${index}`}>
            <label>{this.props.t(channel)}</label>
            <Checkbox
              onChange={() =>
                this.props.setNewsChannel({ name: channel, value: !this.props.channels[channel] })
              }
              theme={styles}
              input={{
                value: true,
                checked: this.props.channels[channel],
              }}/>
          </div>))
        }
      </form>
    );
  }
}

export default SettingsNewsFeed;
