import React, { useContext } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';

const RequestSummary = () => {
  const { data } = useContext(ConnectionContext);

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
        data ? (
          <>
            <h2>{`Request: ${data.sessionRequest.requestEvent.params.request.method}`}</h2>
            <h4>{`Chain Id: ${data.sessionRequest.requestEvent.params.chainId}`}</h4>
            <pre>
              {
                JSON.stringify(data.sessionRequest.requestEvent.params.request.params, null, 2)
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
