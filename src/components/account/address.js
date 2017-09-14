import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './account.css';

const Address = (props) => {
  const title = props.isDelegate ? 'Delegate' : 'Address';
  const content = props.isDelegate ?
    (<div>
      <p className="inner primary delegate-name">
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
      <div className={`${grid.row}`}>
        <div className={`${grid['col-sm-12']} ${grid['col-xs-4']}`}>
          <h3 id="firstBox" className={styles.title}>{title}</h3>
        </div>
        <div className={`${grid['col-sm-12']} ${grid['col-xs-8']}`}>
          <div className={styles['value-wrapper']}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
