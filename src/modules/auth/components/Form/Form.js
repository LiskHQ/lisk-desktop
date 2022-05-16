import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import setPasswordFormContext from '../../context/setPasswordFormContext';

function Form({ onSubmit, validationSchema, children }) {
  const {
    register,
    handleSubmit,
    watch,
    formState,
  } = useForm(validationSchema ? {
    resolver: yupResolver(validationSchema),
  } : undefined);

  return (
    <div>
      <setPasswordFormContext.Provider value={{ register, watch, formState }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {children}
        </form>
      </setPasswordFormContext.Provider>
    </div>

  );
}

export default Form;
