import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { regex } from 'src/const/regex';
import { useCurrentAccount } from '@account/hooks';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import { PrimaryButton } from 'src/theme/buttons';
import { settingsUpdated } from 'src/redux/actions';
import { selectSettings } from 'src/redux/selectors';
import { updateCurrentAccount, updateAccount } from '../../store/action';
import styles from './EditAccountForm.css';

const editAccountFormSchema = yup
  .object({
    accountName: yup
      .string()
      .required()
      .matches(
        regex.accountName,
        'Can be alphanumeric with either !,@,$,&,_,. as special characters'
      )
      .max(20, "Character length can't be more than 20")
      .min(3, "Character length can't be less than 3"),
  })
  .required();

const EditAccountForm = ({ nextStep }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(editAccountFormSchema) });
  const formValues = watch();
  const [currentAccount] = useCurrentAccount();
  const settings = useSelector(selectSettings);

  const onSubmit = async ({ accountName }) => {
    dispatch(updateCurrentAccount({ name: accountName }));
    if (currentAccount.metadata.isHW) {
      const currentHWAccounts = settings.hardwareAccounts[currentAccount.hw.model];
      const currentAccountIndex = currentAccount.metadata.accountIndex;
      const selectedAccount = currentHWAccounts.find(
        (acc) => acc.metadata.accountIndex === currentAccountIndex
      );
      const updatedHWAccounts = currentHWAccounts.splice(currentAccountIndex, 1, selectedAccount);
      dispatch(
        settingsUpdated({
          hardwareAccounts: {
            ...settings.hardwareAccounts,
            [currentAccount.hw.model]: updatedHWAccounts,
          },
        })
      );
    } else {
      dispatch(
        updateAccount({ encryptedAccount: currentAccount, accountDetail: { name: accountName } })
      );
    }
    nextStep({
      accountName,
    });
  };

  return (
    <Dialog hasClose className={`${styles.dialogWrapper}`}>
      <Box className={`${styles.wrapper}`}>
        <div className={styles.headerWrapper}>
          <h1 data-testid="manage-title">{t('Edit account name')}</h1>
        </div>
        <BoxContent className={styles.content}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              defaultValue={currentAccount.metadata.name}
              value={formValues.accountName}
              size="s"
              label={t('Account name')}
              placeholder={t('Enter name')}
              feedback={errors.accountName?.message}
              status={errors.accountName ? 'error' : undefined}
              {...register('accountName')}
            />
            <PrimaryButton className={styles.button} disabled={!isDirty} type="submit">
              {t('Done')}
            </PrimaryButton>
          </form>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default EditAccountForm;
