import React, { useState } from 'react';

import Icon from 'src/theme/Icon';
import { Input } from 'src/theme';
import Tabs from 'src/theme/tabs';

import styles from './styles.css';

const MemberField = ({
  t,
  index,
  publicKey,
  isMandatory,
  showDeleteIcon,
  onChangeMember,
  onDeleteMember,
}) => {
  const [mandatoryFlag, setMandatoryFlag] = useState('mandatory');

  const changeCategory = (flag) => {
    onChangeMember({ index, publicKey, isMandatory: flag === t('Mandatory') });
  };
  const categoryTabs = {
    tabs: [
      {
        value: 'mandatory',
        name: t('Mandatory'),
        className: `mandatory select-mandatory ${mandatoryFlag === 'mandatory' ? styles.active : ''}`,
      },
      {
        value: 'optional',
        name: t('Optional'),
        className: `optional select-optional ${mandatoryFlag === 'optional' ? styles.active : ''}`,
      },
    ],
    active: mandatoryFlag,
    onClick: ({ value }) => {
      setMandatoryFlag(value);
      changeCategory(mandatoryFlag);
    },
    className: `${styles.memberCategory} mandatory-toggle`,
    wrapperClassName: styles.categoryWrapper,
  };

  const changeIdentifier = (e) => {
    const value = e.target.value;
    onChangeMember({ index, publicKey: value, isMandatory });
  };

  const deleteMember = () => onDeleteMember(index);

  return (
    <div className={styles.memberFieldContainer}>
      <div className={styles.memberInput}>
        <Input
          className={`${styles.inputWithSwitcher} msign-pk-input`}
          onChange={changeIdentifier}
          placeholder={t('Public key')}
          size="m"
        />
        <Tabs {...categoryTabs} />
      </div>
      {showDeleteIcon && (
        <span className={`${styles.deleteIcon} delete-icon`} onClick={deleteMember}>
          <Icon name="deleteIcon" />
        </span>
      )}
    </div>
  );
};

export default MemberField;
