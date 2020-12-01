import styles from './editor.css';

const header = t => ([
  {
    title: t('Delegate'),
    classList: styles.infoColumn,
  },
  {
    title: t('Old Vote Amount'),
    classList: styles.oldAmountColumn,
  },
  {
    title: t('New Vote Amount'),
    classList: styles.newAmountColumn,
    tooltip: {
      title: t('title'),
      message: t('message'),
      position: 'bottom',
    },
  },
  {
    classList: styles.editColumn,
  },
]);

export default header;
