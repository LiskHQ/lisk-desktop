import React from 'react';
import styles from './loadingIcon.css';
import svgIcons from '../../utils/svgIcons';

const LoadingIcon = () => (
  <img src={svgIcons.iconLoader} className={styles.loadingIcon} />
);

export default LoadingIcon;
