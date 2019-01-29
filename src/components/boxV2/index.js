import React from 'react';
import styles from './box.css';

const Box = (props) => {
  const childs = props.children;
  const hasHeader = childs.some(child => typeof child.type !== 'function' && child.type === 'header');

  return (
    <div className={`${styles.wrapper} ${hasHeader ? styles.withHeader : ''} ${props.className}`}>
    { props.children }
    </div>
  );
};

export default Box;
