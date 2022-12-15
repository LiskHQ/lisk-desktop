import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import { addedToWatchList, removedFromWatchList } from 'src/redux/actions';
import getForgingTime from '../../utils/getForgingTime';
import ValidatorRowContext from '../../context/validatorRowContext';
import validatorStyles from '../ValidatorsMonitorView/Validators.css';
import styles from './Schemas.css';
import LayoutSchema from './LayoutSchema';

const ValidatorRow = ({ data, className, activeTab, watchList, setActiveTab }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const formattedForgingTime = getForgingTime(data.nextAllocatedTime);

  const isWatched = watchList.find((address) => address === data.address);

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
      className={`${className} validator-row ${styles.container} ${activeStyle} ${validatorStyles.tableRow}`}
      to={`${routes.validatorProfile.path}?address=${data.address}`}
    >
      <ValidatorRowContext.Provider
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
      </ValidatorRowContext.Provider>
    </Link>
  );
};

export default React.memo(ValidatorRow);
