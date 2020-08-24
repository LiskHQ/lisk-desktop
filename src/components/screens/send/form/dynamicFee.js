import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './form.css';
import Input from '../../../toolbox/inputs/input';

const DynamicFee = ({
  t,
  token = 'LSK',
  initialFeeIndex = 1,
  priorities,
}) => {
  const [selectedPriority, setSelectedPriority] = useState(1);
  const [fee, setFee] = useState(priorities[initialFeeIndex] ? priorities[initialFeeIndex].fee : 0);

  const onClickPriority = (e) => {
    e.preventDefault();
    setSelectedPriority(parseInt(e.target.value, 10));
    setFee(priorities[e.target.value].fee);
  };

  const onInputChange = (e) => {
    e.preventDefault();
    setFee(e.target.value);
  };

  return (
    <div className={`${styles.dynamicFeeWrapper}`}>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>{t('Priority')}</span>
        <div className={`${styles.prioritySelector}`}>
          {priorities.map((priority, index) => (
            <button
              key={`fee-priority-${index}`}
              className={`${styles.feePriority} ${index === selectedPriority ? styles.feePrioritySelected : ''}`}
              onClick={onClickPriority}
              value={index}
            >
              {priority.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>{t('Transaction fee')}</span>
        {priorities[selectedPriority] && !priorities[selectedPriority].fee
          ? (
            <Input
              type="text"
              size="m"
              defaultValue={priorities[0] ? priorities[0].fee : 0.1}
              onChange={onInputChange}
              placeholder="size s"
            />
          )
          : <span className={styles.fee}>{`${fee} ${token}`}</span>
        }
      </div>
    </div>
  );
};

DynamicFee.defaultProps = {
  t: k => k,
  priorities: [],
};

DynamicFee.propTypes = {
  t: PropTypes.func.isRequired,
  token: PropTypes.string,
  priorities: PropTypes.array.isRequired,
  initialFeeIndex: PropTypes.number,
};

export default withTranslation()(DynamicFee);
