// istanbul ignore file
import React from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import usePairings from '@libs/wcm/hooks/usePairings';

const SessionManager = ({ data }) => {
  const { pairings, disconnect } = usePairings(!!client);

  return (
    <div>
      <h2>SessionManager</h2>
      {
        pairings.map(item => (
          <div key={item.topic}>
            <b>{item.peerMetadata.name}</b>
            <span>{item.peerMetadata.description}</span>
            <span>{item.peerMetadata.url}</span>
            <span>{item.topic}</span>
            <button onClick={() => (disconnect(item.topic))}>Remove</button>
          </div>
        ))
      }
      {/* <h2>{`Request: ${data.requestEvent.params.request.method}`}</h2>
      <h4>{`Chain Id: ${data.requestEvent.params.chainId}`}</h4>
      <pre>{JSON.stringify(data.requestEvent.params.request.params, null, 2)}</pre> */}
    </div>
  );
};

export default SessionManager;
