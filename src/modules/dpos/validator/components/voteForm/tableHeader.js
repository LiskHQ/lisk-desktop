import styles from './voteForm.css';

const header = t => ([
  {
    title: t('Delegate'),
    classList: styles.infoColumn,
  },
  {
    title: t('Old vote amount'),
    classList: styles.oldAmountColumn,
  },
  {
    title: t('New vote amount'),
    classList: styles.newAmountColumn,
    tooltip: {
      message: t('The updated amount after voting'),
      position: 'left',
    },
  },
  {
    classList: styles.editColumn,
  },
]);

export default header;
