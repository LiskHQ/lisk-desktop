import React, { useState } from 'react';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { onApprove, onReject } from '@libs/wcm/utils/sessionHandlers';
import { useAccounts } from '@account/hooks';

const ConnectSummary = ({ data, history }) => {
  const [uri, setURI] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const { accounts } = useAccounts();

  const onSelect = (e) => {
    if (e.target.value) {
      setAddresses([...addresses, e.target.name]);
    } else {
      setAddresses(addresses.filter(item => item !== e.target.name));
    }
  };

  const connectHandler = () => {
    addSearchParamsToUrl(history, { modal: 'sessionSuccess' });
    const selectedAccounts = {
      lisk: addresses, // @todo do we need to add other namespaces?
    };
    onApprove(
      data, selectedAccounts,
    );
  };

  const rejectHandler = () => {
    onReject(data);
  };

  return (
    <div>
      <h2>ConnectSummary</h2>
      {
        uri
          ? (<input onChange={(e) => setURI(e.target.value)} />)
          : (
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
          )
      }
    </div>
  );
};

export default ConnectSummary;
