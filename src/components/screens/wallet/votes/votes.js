import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import { Input } from '../../../toolbox/inputs';
import routes from '../../../../constants/routes';
import styles from './votes.css';
import Table from '../../../toolbox/table';
import VoteRow from './voteRow';
import header from './votesTableHeader';
import DialogLink from '../../../toolbox/dialog/link';
import { SecondaryButton } from '../../../toolbox/buttons';

const getMessages = t => ({
  all: t('This account doesn’t have any votes.'),
  filtered: t('This account doesn’t have any votes matching searched username.'),
});

const Votes = ({
  votes, address, t, history, hostVotes = {}, isDelegate, delegates,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const messages = getMessages(t);

  const handleFilter = ({ target }) => {
    setFilterValue(target.value);
  };

  const onRowClick = (rowAddress) => {
    const accountAddress = `${routes.account.path}?address=${rowAddress}`;
    history.push(accountAddress);
  };

  useEffect(() => {
    votes.loadData({ address });
  }, [address, hostVotes]);

  useEffect(() => {
    if (votes.data.length > 0) {
      delegates.loadData({ addressList: votes.data.map(vote => vote.address) });
    }
  }, [votes.data]);

  const areLoading = delegates.isLoading || votes.isLoading;

  return (
    <Box main isLoading={areLoading} className={`${styles.wrapper}`}>
      <BoxHeader>
        <h1>{t('Voted delegates')}</h1>
        <div className={`${styles.filterHolder}`}>
          {!isDelegate && (
          <DialogLink
            className={`${styles.registerDelegate} register-delegate`}
            component="registerDelegate"
          >
            <SecondaryButton size="m">
              {t('Register a delegate')}
            </SecondaryButton>
          </DialogLink>
          )}
          <Input
            className="search"
            disabled={!votes.data.length}
            name="filter"
            value={filterValue}
            placeholder={t('Filter by name')}
            onChange={handleFilter}
            size="m"
          />
        </div>
      </BoxHeader>
      <BoxContent className={`${styles.results} votes-tab`}>
        <Table
          data={votes.data}
          isLoading={areLoading}
          iterationKey="address"
          emptyState={{ message: filterValue ? messages.filtered : messages.all }}
          row={VoteRow}
          additionalRowProps={{
            onRowClick,
            delegates: delegates.data.reduce(
              (acc, delegate) => ({ ...acc, [delegate.address]: delegate }), {},
            ),
          }}
          header={header(t)}
        />
      </BoxContent>
    </Box>
  );
};

Votes.propTypes = {
  address: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default Votes;
