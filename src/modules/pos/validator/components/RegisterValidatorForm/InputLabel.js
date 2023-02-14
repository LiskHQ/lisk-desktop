import React from 'react';
import Tooltip from 'src/theme/Tooltip';
import styles from './Form.css';

const InputLabel = ({ title, tooltip }) => (
  <label className={styles.label}>
    {title}
    <Tooltip position="right">
      <p>
        {tooltip}
      </p>
    </Tooltip>
  </label>
);

export default InputLabel;
