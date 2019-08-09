import React from 'react';
import Header from './header';
import styles from './box.css';

const Box = (props) => {
  const childs = props.children;

  const hasHeader = Array.isArray(childs) && childs.some(child => (
    child && (child.type === 'header' || child.type.displayName === 'Box.Header')
  ));

  return (
    <div className={`${styles.wrapper} ${hasHeader ? styles.withHeader : ''} ${props.className}`}>
      { props.children }
    </div>
  );
};

Box.Header = Header;
export default Box;
