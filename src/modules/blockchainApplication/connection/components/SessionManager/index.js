import React, { useContext } from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import usePairings from '@libs/wcm/hooks/usePairings';

const SessionManager = () => {
  const { pairings, disconnect } = usePairings(!!client);
  const { data } = useContext(ConnectionContext);

  return (
    <div>
      <h2>SessionManager</h2>
      {
        pairings && pairings.map(item => (
          <div key={item.topic}>
            <b>{item.peerMetadata.name}</b>
            <span>{item.peerMetadata.description}</span>
            <span>{item.peerMetadata.url}</span>
            <span>{item.topic}</span>
            <button onClick={() => (disconnect(item.topic))}>Remove</button>
          </div>
        ))
      }
      {
        data.session ? (
          <>
            <h2>{`Request: ${data.session.requestEvent.params.request.method}`}</h2>
            <h4>{`Chain Id: ${data.session.requestEvent.params.chainId}`}</h4>
            <pre>{JSON.stringify(data.session.requestEvent.params.request.params, null, 2)}</pre>
          </>
        ) : null
      }
    </div>
  );
};

export default SessionManager;
