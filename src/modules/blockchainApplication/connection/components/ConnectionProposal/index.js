// istanbul ignore file
import React from 'react';
import { client } from '@libs/wcm/utils/connectionCreator';
import usePairings from '@libs/wcm/hooks/usePairings';

const ProposalInput = () => {
  const { setUri } = usePairings(!!client);

  return (
    <input onChange={(e) => setUri(e.target.value)} />
  );
};

export default ProposalInput;
