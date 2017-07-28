import React from 'react';
import styles from './account.css';

const Address = (props) => {
  const title = props.isDelegate ? 'Delegate' : 'Address';
  const content = props.isDelegate ?
    (<div>
      <p className="inner primary">
        {props.delegate.username}
      </p>
      <p className="inner secondary address">
        <span>{props.address}</span>
      </p>
    </div>)
    : (<p className="inner primary full address">
      {props.address}
    </p>);

  return (
    <div className={`box ${styles['text-center']}`}>
      <h3 id="firstBox" className={styles.title}>{title}</h3>
      <div className={styles['value-wrapper']}>
        {content}
      </div>
    </div>
  );
};

export default Address;
