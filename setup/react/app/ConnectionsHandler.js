import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router';
import ConnectionManager from '@libs/wcm/components/ConnectionManager';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';

const ConnectionsHandler = ({ history }) => {
  const { events } = useContext(ConnectionContext);

  useEffect(() => {
    if (events.length && events[events.length - 1].name === EVENTS.SESSION_REQUEST) {
      addSearchParamsToUrl(history, { modal: 'requestSummary' });
    }
  }, [events]);

  return <ConnectionManager />;
};

export default withRouter(ConnectionsHandler);
