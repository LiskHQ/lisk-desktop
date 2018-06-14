import React from 'react';
import Checkbox from '../toolbox/sliderCheckbox';
import styles from './settingsNewsFeed.css';

const SettingsNewsFeed = props => (
  <div>
    {Object.keys(props.channels).map((channel, index) => (
      <div className={styles.item} key={`channel-${index}`}>
        <label>{props.t(channel)}</label>
        <Checkbox
          onChange={() =>
            props.setNewsChannels({
              channels: {
                ...props.channels,
                [channel]: !props.channels[channel],
              },
            })
          }
          theme={styles}
          input={{
            value: true,
            checked: props.channels[channel],
          }}/>
      </div>))
    }
  </div>
);

export default SettingsNewsFeed;
