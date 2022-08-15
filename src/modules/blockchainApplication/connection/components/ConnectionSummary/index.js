import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { onApprove, onReject } from '@libs/wcm/utils/sessionHandlers';
import { useAccounts } from '@account/hooks';

const ConnectSummary = ({ history }) => {
  const [addresses, setAddresses] = useState([]);
  const { accounts } = useAccounts();
  const { data } = useContext(ConnectionContext);

  const onSelect = (e) => {
    if (e.target.value) {
      setAddresses([...addresses, e.target.name]);
    } else {
      setAddresses(addresses.filter(item => item !== e.target.name));
    }
  };

  const connectHandler = () => {
    onApprove(
      data.proposal, addresses,
    );
    addSearchParamsToUrl(history, { modal: 'connectionSuccess' });
  };

  const rejectHandler = () => {
    onReject(data.proposal);
  };

  return (
    <div>
      <h2>ConnectSummary</h2>
      <div>
        <div>
          <h3>Accounts</h3>
          {
            accounts.map((item) => (
              <label key={item.metadata.address}>
                <input
                  type="checkbox"
                  name={item.metadata.address}
                  onChange={onSelect}
                />
                <span>{item.metadata.address}</span>
              </label>
            ))
          }
        </div>
        <button onClick={connectHandler}>Connect</button>
        <button onClick={rejectHandler}>Reject</button>
      </div>
    </div>
  );
};

export default withRouter(ConnectSummary);
