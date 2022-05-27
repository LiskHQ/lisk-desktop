import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import routes from '@screens/router/routes';
import { useTheme } from 'src/theme/Theme';
import { addedToWatchList, removedFromWatchList } from '@common/store/actions';
import getForgingTime from '../../utils/getForgingTime';
import DelegateRowContext from '../../context/delegateRowContext';
import styles from '../delegatesMonitorView/delegates.css';
// import {
//   DelegateWeight,
//   DelegateDetails,
//   RoundState,
//   DelegateStatus,
//   ForgingTime,
//   DelegateRank,
// } from './dataColumns';
import LayoutSchema from './layoutSchema';

const DelegateRow = ({
  data, className, t, activeTab, watchList, setActiveTab, blocks,
}) => {
  const formattedForgingTime = getForgingTime(
    data.nextForgingTime || blocks.forgers[blocks.indexBook[data.address]]?.nextForgingTime,
  );
  const dispatch = useDispatch();
  const theme = useTheme();

  const isWatched = watchList.find(address => address === data.address);

  const removeFromWatchList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (watchList.length === 1) {
      setActiveTab('active');
    }
    dispatch(removedFromWatchList({ address: data.address }));
  };

  const addToWatchList = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addedToWatchList({ address: data.address }));
  };

  const Layout = LayoutSchema[activeTab] || LayoutSchema.default;

  return (
    <Link
      className={`${className} delegate-row ${styles.tableRow}`}
      to={`${routes.explorer.path}?address=${data.address}`}
    >
      <DelegateRowContext.Provider
        value={{
          data,
          activeTab,
          watched: isWatched,
          addToWatchList,
          removeFromWatchList,
          value: data.totalVotesReceived,
          state: data.state,
          time: formattedForgingTime,
          status: data.status,
          isBanned: data.isBanned,
          totalVotesReceived: data.totalVotesReceived,
          theme,
          t,
        }}
      >
        {Layout.components.map((Component, index) => (
          <Component key={index} t={t} />
        ))}
      </DelegateRowContext.Provider>
      {/* <DelegateDetail
        t={t}
        data={data}
        watched={isWatched}
        activeTab={activeTab}
        addToWatchList={addToWatchList}
        removeFromWatchList={removeFromWatchList}
      />
      <DelegateWeight
        value={data.totalVotesReceived}
        activeTab={activeTab}
      />
      {
        (activeTab === 'active' || activeTab === 'watched' || activeTab === 'standby')
          ? (
            <DelegateRank
              data={data}
              activeTab={activeTab}
            />
          ) : null
      }
      {
        (activeTab === 'active' || activeTab === 'watched')
          ? (
            <>
              <ForgingTime
                state={data.state}
                time={formattedForgingTime}
                activeTab={activeTab}
              />
              <RoundState
                status={data.status}
                state={data.state || blocks.forgers[blocks.indexBook[data.address]]?.state}
                lastBlock={data.lastBlock}
                isBanned={data.isBanned}
                t={t}
                time={formattedForgingTime}
                activeTab={activeTab}
              />
            </>
          ) : null
      }
      {
        activeTab !== 'active'
          ? (
            <DelegateStatus
              status={data.status}
              totalVotesReceived={data.totalVotesReceived}
              activeTab={activeTab}
              theme={theme}
            />
          ) : null
      } */}
    </Link>
  );
};

export default React.memo(DelegateRow);
