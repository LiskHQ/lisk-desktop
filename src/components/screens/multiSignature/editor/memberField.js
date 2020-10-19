import React from 'react';

import { SecondaryButton } from '../../../toolbox/buttons';
import Icon from '../../../toolbox/icon';
import { InputWithDropdown } from '../../../toolbox/inputs';

import styles from './styles.css';

const MemberField = ({
  t, index, identifier, isMandatory, showDeleteIcon, onChangeMember, onDeleteMember,
}) => {
  const changeCategory = (flag) => {
    onChangeMember({ index, identifier, isMandatory: flag });
  };

  const changeIdentifier = (e) => {
    const newIdentifier = e.target.value;
    onChangeMember({ index, identifier: newIdentifier, isMandatory });
  };

  const deleteMember = () => onDeleteMember(index);

  return (
    <div className={styles.memberFieldContainer}>
      <InputWithDropdown
        t={t}
        value={identifier}
        onChange={changeIdentifier}
        ButtonComponent={SecondaryButton}
        buttonLabel={isMandatory ? t('Mandatory') : t('Optional')}
      >
        <span onClick={() => changeCategory(true)}>
          {t('Mandatory')}
        </span>
        <span onClick={() => changeCategory(false)}>
          {t('Optional')}
        </span>
      </InputWithDropdown>
      {showDeleteIcon && <span className={styles.deleteIcon} onClick={deleteMember}><Icon name="deleteIcon" /></span>}
    </div>
  );
};


export default MemberField;
