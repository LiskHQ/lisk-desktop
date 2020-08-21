import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import styles from './form.css';
import Input from '../../../toolbox/inputs/input';

const priorities = ['Low', 'Medium', 'High', 'Custom'];

const DynamicFee = ({ t }) => {
  const [selectedPriority, setSelectedPriority] = useState(priorities[1]);
  const [fee, setFee] = useState(0.1);

  const onClickPriority = (e) => {
    e.preventDefault();
    setSelectedPriority(e.target.value);
  };

  const onInputChange = (e) => {
    e.preventDefault();
    setFee(e.target.value);
  };

  console.log(selectedPriority, fee);

  return (
    <div className={`${styles.dynamicFeeWrapper}`}>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>{t('Priority')}</span>
        <div className={`${styles.prioritySelector}`}>
          {priorities.map(priority => (
            <button
              key={`fee-priority-${priority}`}
              className={`${styles.feePriority} ${priority === selectedPriority ? styles.feePrioritySelected : ''}`}
              onClick={onClickPriority}
              value={priority}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>{t('Transaction fee')}</span>
        {selectedPriority === 'Custom'
          ? (
            <Input
              type="text"
              size="m"
              value={fee}
              onChange={onInputChange}
              placeholder="size m"
            />
          )
          : <span className={styles.fee}>{`${fee} LSK`}</span>
        }
      </div>
    </div>
  );
};

export default withTranslation()(DynamicFee);
