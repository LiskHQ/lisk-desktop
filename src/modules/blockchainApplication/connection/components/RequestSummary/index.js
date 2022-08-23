import React, { useContext } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';

const RequestSummary = () => {
  const { events } = useContext(ConnectionContext);

  const approveHandler = () => {
    // sign the tx
    // respond
  };
  const rejectHandler = () => {
    // respond
  };

  return (
    <div>
      <h2>RequestSummary</h2>
      {
        events ? (
          <>
            <h2>{`Request: ${events.meta.sessionRequest.requestEvent.params.request.method}`}</h2>
            <h4>{`Chain Id: ${events.meta.sessionRequest.requestEvent.params.chainId}`}</h4>
            <pre>
              {
                JSON.stringify(events.meta.sessionRequest.requestEvent.params.request.params, null, 2)
              }
            </pre>
            <button oncClick={approveHandler}>Approve</button>
            <button oncClick={rejectHandler}>Reject</button>
          </>
        ) : <span>Loading</span>
      }
    </div>
  );
};

export default RequestSummary;
