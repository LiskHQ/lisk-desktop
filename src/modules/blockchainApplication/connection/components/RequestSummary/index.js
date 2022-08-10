import React from 'react';

const RequestSummary = ({ data }) => {
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
            <h2>{`Request: ${data.requestEvent.params.request.method}`}</h2>
            <h4>{`Chain Id: ${data.requestEvent.params.chainId}`}</h4>
            <pre>{JSON.stringify(data.requestEvent.params.request.params, null, 2)}</pre>
            <button oncClick={approveHandler}>Approve</button>
            <button oncClick={rejectHandler}>Reject</button>
          </>
        ) : <span>Loading</span>
      }
    </div>
  );
};

export default RequestSummary;
