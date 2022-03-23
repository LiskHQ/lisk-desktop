import React from 'react';
import { tokenMap } from '@common/configuration';
import LiskAmount from '@shared/liskAmount';
/**
 * This component acts as an adapter for diversions in consecutive versions of API
 * @param {Object} data The delegate information
 */
const VoteWeight = ({ data }) => (
  <strong>
    <LiskAmount
      val={data.voteWeight}
      token={tokenMap.LSK.key}
      showInt
    />
  </strong>
);

export default VoteWeight;
