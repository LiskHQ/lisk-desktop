import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import routes from 'src/routes/routes';
import { addedToWatchList, removedFromWatchList } from 'src/redux/actions';
import getForgingTime from '../../utils/getForgingTime';
import DelegateRowContext from '../../context/delegateRowContext';
import delegateStyles from '../DelegatesMonitorView/delegates.css';
import styles from './schemas.css';
import LayoutSchema from './layoutSchema';

const DelegateRow = ({
  data, className, t, activeTab, watchList, setActiveTab,
}) => {
  const formattedForgingTime = getForgingTime(data.nextForgingTime);
  const dispatch = useDispatch();

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
  const activeStyle = activeTab === 'active' ? styles.fullLayout : styles[activeTab];

  return (
    <Link
      className={`${className} delegate-row ${styles.container} ${activeStyle} ${delegateStyles.tableRow}`}
      to={`${routes.explorer.path}?address=${data.address}`}
    >
      <DelegateRowContext.Provider
        value={{
          data,
          activeTab,
          watched: isWatched,
          addToWatchList,
          removeFromWatchList,
          time: formattedForgingTime,
          t,
        }}
      >
        {Layout.components.map((Component, index) => (
          <Component key={index} t={t} />
        ))}
      </DelegateRowContext.Provider>
    </Link>
  );
};

export default React.memo(DelegateRow);
