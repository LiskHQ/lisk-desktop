import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './dynamicFee.css';
import { tokenMap } from '../../../constants/tokens';
import Input from '../../toolbox/inputs/input';
import Icon from '../../toolbox/icon';
import Tooltip from '../../toolbox/tooltip/tooltip';

const DynamicFee = ({
  t,
  token,
  priorities,
  selectedPriority,
  setSelectedPriority,
  fee,
}) => {
  const [customFee, setCustomFee] = useState(0.1);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const isCustom = selectedPriority > priorities.length;
  const currentFee = !isCustom && priorities[selectedPriority]
    ? priorities[selectedPriority].fee : customFee;

  const onClickPriority = (e) => {
    e.preventDefault();
    const selectedIndex = Number(e.target.value);
    setSelectedPriority({ item: priorities[selectedIndex], index: selectedIndex });
    if (showEditIcon) setShowEditIcon(false);
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
    <div className={`${styles.dynamicFeeWrapper} ${styles.fieldGroup} processing-speed`}>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Priority')}
          <Tooltip>
            <p className={styles.tooltipText}>
              {
                    t('Lorem Ipsum...')
                  }
            </p>
          </Tooltip>
        </span>
        <div className={`${styles.prioritySelector}`}>
          {priorities.map((priority, index) => (
            <button
              key={`fee-priority-${index}`}
              className={`${styles.feePriority} ${index === selectedPriority ? styles.feePrioritySelected : ''}`}
              onClick={onClickPriority}
              value={index}
            >
              {priority.title}
            </button>
          ))}
          {token === tokenMap.LSK.key && (
            <button
              className={`${styles.feePriority} ${isCustom ? styles.feePrioritySelected : ''}`}
              onClick={onClickPriority}
              value={priorities.length + 1}
            >
              {t('custom')}
            </button>
          )}
        </div>
      </div>
      <div className={`${styles.col}`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Transaction fee')}
          <Tooltip>
            <p className={styles.tooltipText}>
              {
                    t('Lorem Ipsum...')
                  }
            </p>
          </Tooltip>
        </span>
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
          <span className={styles.fee} onClick={onClickCustomEdit}>
            {fee}
            {isCustom && showEditIcon && <Icon name="edit" />}
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
  selectedPriority: PropTypes.number,
  setSelectedPriority: PropTypes.func,
  fee: PropTypes.number,
};

export default withTranslation()(DynamicFee);
