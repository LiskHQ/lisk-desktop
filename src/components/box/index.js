import React from 'react';
import styles from './box.css';

const Box = ({ className, children }) => (<div className={`${styles.wrapper} ${className}`}>
  { children }
</div>);

export default Box;
