import React from 'react';
import { TooltipWrapper } from '../timestamp';

const getStatusTooltip = (props) => {
  if (props.secondSignature) {
    return props.t('This account is protected by a second passphrase');
  } else if (props.passphrase) {
    return props.t('Passphrase of the account is saved till the end of the session.');
  }
  return props.t('Passphrase of the account will be required to perform any transaction.');
};

const Address = (props) => {
  const title = props.isDelegate ? props.t('Delegate') : props.t('Address');
  const content = props.isDelegate ?
    (<div>
      <span className="inner primary delegate-name">
        {props.delegate.username}
      </span>
      <span className="inner secondary address">
        <span>{props.address}</span>
      </span>
    </div>)
    : (<span className="inner primary full address">
      {props.address}
    </span>);

  return (
    <div>
      <div>
        <div>
          <h3 id="firstBox">{title}</h3>
        </div>
        <div>
          <div>
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
