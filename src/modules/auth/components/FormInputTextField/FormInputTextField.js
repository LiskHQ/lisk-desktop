import React, { useCallback, useContext, useState } from 'react';
import Input from 'src/theme/Input';
import Icon from 'src/theme/Icon';
import setPasswordFormContext from '../../context/setPasswordFormContext';
import styles from './FromInputTextField.css';

function PasswordTypeToggler({ onClick, isPasswordVisible }) {
  return (
    <button onClick={onClick} className={styles.toggleBtn}>
      <Icon
        name={isPasswordVisible ? 'eyeActive' : 'eyeInactive'}
        className={styles.toggleIcon}
      />
    </button>
  );
}

function FormInputTextField({ name, label, secureTextEntry }) {
  const { register } = useContext(setPasswordFormContext);
  const [isPassword, setIsPassword] = useState(secureTextEntry);

  const toggleFieldType = useCallback(() => {
    setIsPassword(!isPassword);
  }, [isPassword]);

  return (
    <Input
      autoComplete="off"
      size="xs"
      name={name}
      label={label}
      type={isPassword ? 'password' : 'text'}
      endComponent={secureTextEntry && (
        <PasswordTypeToggler
          isPasswordVisible={!isPassword}
          onClick={toggleFieldType}
        />
      )}
      {...register(name)}
    />
  );
}

export default FormInputTextField;
