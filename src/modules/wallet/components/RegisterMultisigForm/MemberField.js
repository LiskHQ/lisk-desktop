import React from 'react';

import Icon from 'src/theme/Icon';
import { Input } from 'src/theme';

import CategorySwitch from './CategorySwitch';
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
  const handleChangeCategory = (e) => {
    const {
      target: { value: flag },
    } = e;
    onChangeMember({ index, publicKey, isMandatory: flag === 'mandatory' });
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
          placeholder={t('Enter public key')}
          size="m"
          value={publicKey}
        />
        <CategorySwitch
          index={index}
          onChangeCategory={handleChangeCategory}
          value={isMandatory ? 'mandatory' : 'optional'}
          categories={[
            { value: 'mandatory', label: t('Mandatory') },
            { value: 'optional', label: t('Optional') },
          ]}
        />
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
