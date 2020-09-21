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

// eslint-disable-next-line max-statements
const Votes = ({
  votes, delegates, address, t, history,
}) => {
  const [tOut, setTout] = useState();
  const [mergedVotes, setMergedVotes] = useState([]);
  const [showing, setShowing] = useState(30);
  const [filterValue, setFilterValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const votesKey = 'voteWeight';

  const fetchDelegateWhileNeeded = () => {
    const delegatesData = delegates.data;
    const filteredVotes = votes.data.filter(vote => RegExp(filterValue, 'i').test(vote.username));
    const mVotes = filteredVotes.map((vote) => {
      const delegate = delegatesData[vote.username] || {};
      return { ...vote, ...delegate };
    }).sort((a, b) => {
      if (!a[votesKey] && !b[votesKey]) return 0;
      if (!a[votesKey] || +a[votesKey] > +b[votesKey]) return 1;
      return -1;
    });
    if (mVotes.length && !(mVotes.slice(0, showing).slice(-1)[0] || {})[votesKey]) {
      const offset = Object.keys(delegatesData).length;
      delegates.loadData({ offset, limit: 101 });
    }
    setMergedVotes(mVotes);
  };

  const onShowMore = () => {
    setShowing(showing + 30);
  };

  const handleFilter = ({ target }) => {
    clearTimeout(tOut);
    setFilterValue(target.value);
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    setTout(timeout);
  };

  const onRowClick = (rowAddress) => {
    const accountAddress = `${routes.account.path}?address=${rowAddress}`;
    history.push(accountAddress);
  };

  useEffect(() => {
    votes.loadData({ address });
    delegates.loadData({});

    return () => clearTimeout(tOut);
  }, []);

  useEffect(() => {
    votes.loadData({ address });
    fetchDelegateWhileNeeded();
  }, [address]);

  // useEffect(() => {
  //   fetchDelegateWhileNeeded();
  // }, [delegates.data, votes.data.length, showing, filterValue]);


  const filteredVotes = mergedVotes.filter(vote => RegExp(filterValue, 'i').test(vote.username));
  const canLoadMore = filteredVotes.length > showing;
  const areLoading = isLoading || delegates.isLoading || votes.isLoading;

  return (
    <Box main isLoading={areLoading} className={`${styles.wrapper}`}>
      <BoxHeader>
        <h1>{t('Voted delegates')}</h1>
        <div className={`${styles.filterHolder}`}>
          <DialogLink
            className={`${styles.registerDelegate} register-delegate`}
            component="registerDelegate"
          >
            <SecondaryButton size="m">
              {t('Register a delegate')}
            </SecondaryButton>
          </DialogLink>
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
      <BoxContent className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} votes-tab`}>
        <Table
          data={filteredVotes.slice(0, showing)}
          canLoadMore={canLoadMore}
          isLoading={areLoading}
          iterationKey="address"
          emptyState={{ message: t('This account doesn’t have any votes.') }}
          row={VoteRow}
          additionalRowProps={{
            t,
            onRowClick,
          }}
          loadData={onShowMore}
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
