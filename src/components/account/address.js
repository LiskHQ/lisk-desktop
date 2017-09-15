import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { TooltipWrapper } from '../timestamp';
import styles from './account.css';

const getStatusTooltip = (props) => {
  if (props.secondSignature) {
    return 'This account is protected by a second passphrase';
  }
  return (props.passphrase ?
    'Passphrase of the acount is saved till the end of the session.' :
    'Passphrase of the acount will be required to perform any transaction.');
};

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
            <span className="status">
              <TooltipWrapper tooltip={getStatusTooltip(props)}>
                <i className="material-icons">{props.passphrase && !props.secondSignature ? 'lock_open' : 'lock'}</i>
              </TooltipWrapper>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
