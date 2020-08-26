import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './form.css';
import Input from '../../../toolbox/inputs/input';
import Icon from '../../../toolbox/icon';

const DynamicFee = ({
  t,
  token = 'LSK',
  initialFeeIndex = 1,
  priorities,
}) => {
  const [selectedPriority, setSelectedPriority] = useState(initialFeeIndex);
  const [customFee, setCustomFee] = useState(0.1);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const isCustom = priorities[selectedPriority] && !priorities[selectedPriority].fee;
  const currentFee = !isCustom && priorities[selectedPriority]
    ? priorities[selectedPriority].fee : customFee;

  const onClickPriority = (e) => {
    e.preventDefault();
    setSelectedPriority(parseInt(e.target.value, 10));
    setShowEditIcon(false);
  };

  const onInputChange = (e) => {
    e.preventDefault();
    setCustomFee(e.target.value);
  };

  const onInputBlur = (e) => {
    e.preventDefault();
    setCustomFee(e.target.value);
    setShowEditIcon(true);
  };

  const onClickCustomEdit = (e) => {
    e.preventDefault();
    setShowEditIcon(false);
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
        {isCustom && !showEditIcon ? (
          <Input
            autoFocus
            type="text"
            size="m"
            defaultValue={customFee}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        ) : (
          <span className={styles.fee}>
            {`${currentFee} ${token}`}
            {isCustom && showEditIcon && <Icon name="edit" onClick={onClickCustomEdit} />}
          </span>
        )}
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
