import React from 'react';
import { useSelector } from 'react-redux';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';
/**
 * This component acts as an adapter for diversions in consecutive versions of API
 * @param {Object} data The delegate information
 */
const RankOrStatus = ({ data }) => {
  const apiVersion = useSelector(state => state.network.apiVersion);

  return (
    <strong>
      <LiskAmount
        val={apiVersion === '2.x' ? data.vote : data.voteWeight}
        roundTo={0}
        token={tokenMap.LSK.key}
      />
    </strong>
  );
};

export default RankOrStatus;
