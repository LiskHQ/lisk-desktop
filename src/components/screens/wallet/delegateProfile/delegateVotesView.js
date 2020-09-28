import React, { useState } from 'react';

import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxHeader from '../../../toolbox/box/header';
import { Input } from '../../../toolbox/inputs';
import regex from '../../../../utils/regex';

import EmptyState from './emptyState';
import styles from './delegateProfile.css';

const Item = props => (
  <div className={styles.voteItem} key={props.index}>
    <AccountVisual
      className={styles.accountVisual}
      address={props.address}
      size={44}
    />
    <div className={styles.address}>{props.address}</div>
  </div>
);

const DelegateVotesView = ({
  voters, t,
}) => {
  const [searchedAddress, setSearchedAddress] = useState();

  const onInputChange = (e) => {
    setSearchedAddress(e.target.value);
  };

  const votersToDisplay = [];

  if (searchedAddress) {
    if (regex.address.test(searchedAddress)) {
      const filteredVoters = voters.filter(address => (address === searchedAddress));
      votersToDisplay.push(...filteredVoters);
    }
  } else {
    votersToDisplay.push(...voters);
  }

  console.log(voters);
  return (
    <Box>
      <BoxHeader>
        <h1>
          <span>{t('Placeholder Voters')}</span>
          {votersToDisplay.length > 0 && <span className={styles.totalVotes}>{` (${voters.length})`}</span>}
        </h1>
        {voters.length > 0 && (
          <span>
            <Input
              onChange={onInputChange}
              value={searchedAddress}
              className="filter-by-address"
              size="m"
              placeholder={t('Filter by address...')}
            />
          </span>
        )}
      </BoxHeader>
      {votersToDisplay.length > 0
        ? (
          <BoxContent className={`${styles.votesContainer} votes-container`}>
            {votersToDisplay.map((address, index) => (
              <Item key={index} address={address} />
            ))}
          </BoxContent>
        )
        : <EmptyState message={t('No voters found.')} />}
    </Box>
  );
};

export default DelegateVotesView;
