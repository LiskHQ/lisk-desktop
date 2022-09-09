import React from 'react';

import { SecondaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { DropdownInput } from 'src/theme';

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
  const changeCategory = (flag) => {
    onChangeMember({ index, publicKey, isMandatory: flag });
  };

  const changeIdentifier = (e) => {
    const value = e.target.value;
    onChangeMember({ index, publicKey: value, isMandatory });
  };

  const deleteMember = () => onDeleteMember(index);

  return (
    <div className={styles.memberFieldContainer}>
      <DropdownInput
        t={t}
        className={`${styles.inputWithDropdown} msign-pk-input`}
        value={publicKey}
        onChange={changeIdentifier}
        placeholder={t('Account public key')}
        ButtonComponent={SecondaryButton}
        buttonLabel={isMandatory ? t('Mandatory') : t('Optional')}
        buttonClassName="mandatory-toggle"
      >
        <span className="select-optional" onClick={() => changeCategory(false)}>
          {t('Optional')}
        </span>
        <span className="select-mandatory" onClick={() => changeCategory(true)}>
          {t('Mandatory')}
        </span>
      </DropdownInput>
      {showDeleteIcon && (
        <span className={`${styles.deleteIcon} delete-icon`} onClick={deleteMember}>
          <Icon name="deleteIcon" />
        </span>
      )}
    </div>
  );
};

export default MemberField;
