/* istanbul ignore file */
// @todo Add test coverage by #4418
import React, { useContext, useEffect, useState } from 'react';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { approveLiskRequest, rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';

const RequestSummary = () => {
  const { events } = useContext(ConnectionContext);
  const [request, setRequest] = useState(null);

  const approveHandler = () => {
    approveLiskRequest(request, request.params.request.params.address);
  };
  const rejectHandler = () => {
    rejectLiskRequest(request);
  };

  useEffect(() => {
    const event = events.find(e => e.name === EVENTS.SESSION_REQUEST);
    if (event) {
      setRequest(event.meta);
    }
  }, []);

  return (
    <div>
      <h2>RequestSummary</h2>
      {
        request ? (
          <>
            <h2>{`Request: ${request.params.request.method}`}</h2>
            <h4>{`Chain Id: ${request.params.chainId}`}</h4>
            <pre>
              {
                JSON.stringify(request.params.request.params, null, 2)
              }
            </pre>
            <button onClick={approveHandler}>Approve</button>
            <button onClick={rejectHandler}>Reject</button>
          </>
        ) : <span>Loading</span>
      }
    </div>
  );
};

export default RequestSummary;
