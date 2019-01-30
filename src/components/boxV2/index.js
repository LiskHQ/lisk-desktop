import React from 'react';
import styles from './box.css';

const Box = (props) => {
  const childs = props.children;

  const hasHeader = Array.isArray(childs) && childs.some(child => child.type === 'header');

  return (
    <div className={`${styles.wrapper} ${hasHeader ? styles.withHeader : ''} ${props.className}`}>
    { props.children }
    </div>
  );
};

export default Box;
