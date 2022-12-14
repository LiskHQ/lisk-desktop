import styles from './voteForm.css';

const header = (t) => [
  {
    title: t('Validator'),
    classList: styles.infoColumn,
  },
  {
    title: t('Stake amount'),
    classList: styles.amountColumn,
  },
  {
    classList: styles.editColumn,
  },
];

export default header;
