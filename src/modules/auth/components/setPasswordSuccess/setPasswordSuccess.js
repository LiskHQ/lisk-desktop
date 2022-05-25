import React from 'react';
import { useTransition } from 'react-i18next';

function setPasswordSuccess() {
  const { t } = useTransition();

  return (
    <div>{t("Perfect! You're all set")}</div>
  );
}

export default setPasswordSuccess;
