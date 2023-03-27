import grid from 'flexboxgrid/dist/flexboxgrid.css';

const header = (t) => [
  {
    title: t('Sender'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Recipient'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Amount'),
    classList: grid['col-xs-2'],
  },
  {
    title: '',
    classList: grid['col-xs-2'],
  },
];

export default header;
